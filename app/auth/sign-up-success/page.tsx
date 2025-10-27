import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function SignUpSuccessPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="w-full max-w-sm">
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-green-600">Account Created!</CardTitle>
            <CardDescription>Check your email to confirm your account</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <p className="text-sm text-gray-600">
                We&apos;ve sent a confirmation email to your inbox. Please click the link in the email to verify your
                account before logging in.
              </p>
              <Link href="/auth/login">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">Back to Login</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
