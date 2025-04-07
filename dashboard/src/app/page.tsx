// app/page.tsx
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <main className="flex items-center justify-center min-h-screen bg-white">
      <h1 className="text-4xl text-red-500 font-bold">Hello World</h1>
      <Button className="text-yellow-400">Click me</Button>
    </main>
  )
}
