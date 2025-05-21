"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { User, Package, Bell, Home, Phone, Save } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { ThemedProductContainer } from "@/components/themed-product-container"

export default function ProfilePage() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    notifications: {
      email: true,
      offers: true,
      updates: false,
    },
  })

  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      router.push("/login?redirect=/profile")
      return
    }

    // Load user data
    setProfileData({
      name: user.name || "",
      email: user.email || "",
      phone: localStorage.getItem(`${user.id}-phone`) || "",
      address: localStorage.getItem(`${user.id}-address`) || "",
      city: localStorage.getItem(`${user.id}-city`) || "",
      notifications: JSON.parse(
        localStorage.getItem(`${user.id}-notifications`) || '{"email":true,"offers":true,"updates":false}',
      ),
    })
  }, [user, router])

  if (!user) {
    return null
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProfileData((prev) => ({ ...prev, [name]: value }))
  }

  const handleNotificationChange = (key: string, checked: boolean) => {
    setProfileData((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: checked,
      },
    }))
  }

  const handleSaveProfile = () => {
    setIsSaving(true)

    // Simulate API call
    setTimeout(() => {
      // Save to localStorage
      localStorage.setItem(`${user.id}-phone`, profileData.phone)
      localStorage.setItem(`${user.id}-address`, profileData.address)
      localStorage.setItem(`${user.id}-city`, profileData.city)
      localStorage.setItem(`${user.id}-notifications`, JSON.stringify(profileData.notifications))

      setIsSaving(false)
      setIsEditing(false)

      toast({
        title: "Profile updated",
        description: "Your profile information has been saved.",
      })
    }, 1000)
  }

  const getOrderHistory = () => {
    // Mock order history
    return [
      {
        id: "ORD-123456",
        date: "2023-12-10",
        status: "Delivered",
        total: 1299,
        items: 3,
      },
      {
        id: "ORD-123457",
        date: "2023-12-05",
        status: "Processing",
        total: 899,
        items: 2,
      },
      {
        id: "ORD-123458",
        date: "2023-11-28",
        status: "Delivered",
        total: 499,
        items: 1,
      },
    ]
  }

  const orders = getOrderHistory()

  return (
    <div className="container py-8">
      <ThemedProductContainer className="p-6 border shadow-sm">
        <h1 className="text-3xl font-bold mb-8">My Profile</h1>
        
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">
              <User className="h-4 w-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="orders">
              <Package className="h-4 w-4 mr-2" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Manage your personal details and contact information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={profileData.name}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={profileData.email}
                    onChange={handleInputChange}
                    disabled={true} // Email cannot be changed
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      name="phone"
                      value={profileData.phone}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                {isEditing ? (
                  <>
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSaveProfile} disabled={isSaving}>
                      {isSaving ? "Saving..." : "Save Changes"}
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
                )}
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Shipping Address</CardTitle>
                <CardDescription>Manage your shipping address for faster checkout</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <div className="flex items-center space-x-2">
                    <Home className="h-4 w-4 text-muted-foreground" />
                    <Input
                      id="address"
                      name="address"
                      value={profileData.address}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      placeholder="Enter your address"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    name="city"
                    value={profileData.city}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    placeholder="Enter your city"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <div className="text-sm text-muted-foreground">
                  Your shipping address will be used as the default for all orders.
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Orders History</CardTitle>
                <CardDescription>View your past orders and track current orders</CardDescription>
              </CardHeader>
              <CardContent>
                {orders.length > 0 ? (
                  <div className="space-y-6">
                    {orders.map((order) => (
                      <div key={order.id} className="border rounded-lg p-4">
                        <div className="flex flex-col sm:flex-row justify-between mb-4">
                          <div>
                            <h3 className="font-medium">{order.id}</h3>
                            <p className="text-sm text-muted-foreground">
                              Placed on {new Date(order.date).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="mt-2 sm:mt-0">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                order.status === "Delivered" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
                              }`}
                            >
                              {order.status}
                            </span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="text-sm">
                            <span className="text-muted-foreground">Items: </span>
                            <span>{order.items}</span>
                          </div>
                          <div>
                            <span className="font-medium">₱{order.total.toLocaleString()}</span>
                          </div>
                        </div>
                        <div className="mt-4">
                          <Button variant="outline" size="sm" className="w-full sm:w-auto">
                            View Order Details
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No orders yet</h3>
                    <p className="text-muted-foreground mb-4">You haven't placed any orders yet.</p>
                    <Button asChild>
                      <a href="/">Start Shopping</a>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Manage how we contact you</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-notifications">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive order confirmations and shipping updates</p>
                  </div>
                  <Switch
                    id="email-notifications"
                    checked={profileData.notifications.email}
                    onCheckedChange={(checked) => handleNotificationChange("email", checked)}
                    disabled={!isEditing}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="special-offers">Special Offers</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications about sales and special offers</p>
                  </div>
                  <Switch
                    id="special-offers"
                    checked={profileData.notifications.offers}
                    onCheckedChange={(checked) => handleNotificationChange("offers", checked)}
                    disabled={!isEditing}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="product-updates">Product Updates</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications about new products and restocks</p>
                  </div>
                  <Switch
                    id="product-updates"
                    checked={profileData.notifications.updates}
                    onCheckedChange={(checked) => handleNotificationChange("updates", checked)}
                    disabled={!isEditing}
                  />
                </div>
              </CardContent>
              <CardFooter>
                {isEditing ? (
                  <Button onClick={handleSaveProfile} disabled={isSaving} className="ml-auto">
                    <Save className="mr-2 h-4 w-4" />
                    {isSaving ? "Saving..." : "Save Changes"}
                  </Button>
                ) : (
                  <Button onClick={() => setIsEditing(true)} className="ml-auto">
                    Edit Preferences
                  </Button>
                )}
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </ThemedProductContainer>
    </div>
  )
}
