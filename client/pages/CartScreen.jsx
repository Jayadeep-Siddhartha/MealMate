import React, { useContext, useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { clearCart } from "../redux/slices/cartSlice";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../context/AuthContext";
import API from "../utils/api";

const CartScreen = () => {
  const cartItems = useSelector((state) => state.cart.items);
  const { user } = useContext(AuthContext);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const [reservations, setReservations] = useState([]);
  const [detailedReservations, setDetailedReservations] = useState([]);
  const [loading, setLoading] = useState(false);

  const groupedItems = cartItems.reduce((acc, item) => {
    const cafeId = item.cafeId;
    if (!acc[cafeId]) acc[cafeId] = [];
    acc[cafeId].push(item);
    return acc;
  }, {});

  useEffect(() => {
    const fetchReservations = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const response = await API.get(`/reservations/user/${user._id}`);
        setReservations(response.data);

        const detailedItems = [];
        for (const res of response.data) {
          for (const foodItem of res.foodItems) {
            try {
              const foodRes = await API.get(`/foods/${foodItem.foodId._id}`);
              detailedItems.push({
                _id: foodItem._id,
                quantity: foodItem.quantity,
                food: foodRes.data,
                totalPrice: res.totalPrice,
                isReserved: res.isReserved,
              });
            } catch (err) {
              console.error("Failed to fetch food item:", err);
            }
          }
        }

        setDetailedReservations(detailedItems);
      } catch (err) {
        console.error("Error fetching reservations:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  },[]);

  const handlePlaceOrder = async () => {
    try {
      if (!user) {
        navigation.navigate("Login");
        return;
      }

      setLoading(true);
      console.log("In handle order");

      for (const reservation of reservations) {
        if (reservation.isReserved) continue;
        console.log("Confirming res");
        console.log(reservation);
        const confirmedRes = await API.put(`/reservations/${reservation._id}/confirm`
        );
        console.log("Confirmed res");
        console.log(confirmedRes)
        await API.post("/orders", {
          userId: user._id,
          cafeId: reservation.cafeteriaId,
          reservationId: reservation._id,
          foodItems: reservation.foodItems.map((item) => ({
            foodId: item.foodId._id,
            quantity: item.quantity,
          })),
          totalPrice: reservation.totalPrice,
        });
        
      }
      // await fetchReservations();
      dispatch(clearCart());
      alert("✅ Payment successful! Your order is being prepared 🍽️");
      navigation.navigate("Orders");
    } catch (error) {
      console.error("Order placement failed:", error);
      alert("⚠️ Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const isCartEmpty = Object.keys(groupedItems).length === 0;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Orders</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#f59e0b" style={styles.loader} />
      ) : (
        <>
          <View style={styles.headerContainer}>
            <Text style={styles.headerText}>UPCOMING ORDERS</Text>
            <TouchableOpacity>
              <Text style={styles.clearAllText}>CLEAR ALL</Text>
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
            {/* CART ITEMS */}
            {!isCartEmpty &&
              Object.entries(groupedItems).map(([cafeId, items]) =>
                items.map((item, index) => (
                  <View key={index} style={styles.orderCard}>
                    <Image source={{ uri: item.image }} style={styles.orderImage} />
                    <View style={styles.orderDetails}>
                      <Text style={styles.restaurantName}>{item.name}</Text>
                      <Text style={styles.orderItems}>
                        {item.specialInstructions ||
                          "Shortbread, chocolate turtle cookies, and red velvet."}
                      </Text>
                      <View style={styles.orderFooter}>
                        <Text style={styles.priceCategory}>$$ • {item.category}</Text>
                        <Text style={styles.orderPrice}>IND{Math.ceil(item.price * item.quantity * 0.05).toFixed(2)}/-</Text>
                      </View>
                    </View>
                  </View>
                ))
              )}

            {/* FETCHED RESERVATIONS */}
            {detailedReservations.length > 0 &&
              detailedReservations.map((item) => (
                <View key={item._id} style={styles.orderCard}>
                  <Image
                    source={{
                      uri: item.food.foodImage || "https://via.placeholder.com/100",
                    }}
                    style={styles.orderImage}
                  />
                  <View style={styles.orderDetails}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                      <Text style={styles.restaurantName}>{item.food.foodName}</Text>
                      {item.isReserved && (
                        <Text style={styles.paidTag}>✅ Paid</Text>
                      )}
                    </View>
                    <Text style={styles.orderItems}>Quantity: {item.quantity}</Text>
                    <View style={styles.orderFooter}>
                      <Text style={styles.priceCategory}>{item.food.category}</Text>
                      <Text style={styles.orderPrice}>
                        IND {Math.ceil((item.food.price * item.quantity * 0.05).toFixed(2))}/-
                      </Text>
                    </View>
                  </View>
                </View>
              ))}

            {/* Proceed Button */}
            {detailedReservations.length > 0 &&
              detailedReservations.some((item) => !item.isReserved) && (
                <TouchableOpacity style={styles.proceedButton} onPress={handlePlaceOrder}>
                  <Text style={styles.proceedButtonText}>Proceed Payment</Text>
                </TouchableOpacity>
              )}

            {isCartEmpty && reservations.length === 0 && (
              <Text style={styles.emptyMessage}>No orders yet</Text>
            )}
          </ScrollView>
        </>
      )}
    </View>
  );
};

export default CartScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  headerText: {
    fontSize: 14,
    color: "#9CA3AF",
    fontWeight: "500",
    letterSpacing: 0.5,
  },
  clearAllText: {
    fontSize: 14,
    color: "#9CA3AF",
    fontWeight: "500",
  },
  scrollView: {
    flex: 1,
  },
  orderCard: {
    flexDirection: "row",
    marginBottom: 16,
  },
  orderImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
    backgroundColor: "#E5E7EB",
  },
  orderDetails: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "center",
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  paidTag: {
    backgroundColor: "#D1FAE5",
    color: "#065F46",
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  orderItems: {
    fontSize: 14,
    color: "#4B5563",
    marginBottom: 8,
    lineHeight: 18,
  },
  orderFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  priceCategory: {
    fontSize: 14,
    color: "#6B7280",
  },
  orderPrice: {
    fontSize: 14,
    fontWeight: "500",
    color: "#F59E0B",
  },
  loader: {
    marginTop: 40,
  },
  emptyMessage: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
    color: "#9CA3AF",
  },
  proceedButton: {
    backgroundColor: "#F59E0B",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 12,
    marginBottom: 24,
    marginHorizontal: 8,
  },
  proceedButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});