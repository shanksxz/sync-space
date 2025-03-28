"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SettingsPage() {
	return (
		<DashboardLayout>
			<div className="flex flex-col space-y-6">
				<h1 className="text-3xl font-bold tracking-tight">Settings</h1>

				<Tabs defaultValue="account" className="w-full">
					<TabsList className="w-full max-w-md">
						<TabsTrigger value="account">Account</TabsTrigger>
						<TabsTrigger value="notifications">Notifications</TabsTrigger>
						<TabsTrigger value="security">Security</TabsTrigger>
					</TabsList>

					<TabsContent value="account" className="space-y-4 mt-4">
						<Card>
							<CardHeader>
								<CardTitle>Profile</CardTitle>
								<CardDescription>
									Manage your account information
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="space-y-2">
									<Label htmlFor="name">Name</Label>
									<Input id="name" value="User Name" />
								</div>
								<div className="space-y-2">
									<Label htmlFor="email">Email</Label>
									<Input
										id="email"
										type="email"
										value="user@example.com"
										disabled
									/>
									<p className="text-xs text-muted-foreground">
										Your email is managed by your GitHub account
									</p>
								</div>
							</CardContent>
							<CardFooter>
								<Button>Save Changes</Button>
							</CardFooter>
						</Card>
					</TabsContent>

					<TabsContent value="notifications" className="space-y-4 mt-4">
						<Card>
							<CardHeader>
								<CardTitle>Notifications</CardTitle>
								<CardDescription>
									Manage how you receive notifications
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="flex items-center justify-between">
									<div className="space-y-0.5">
										<Label htmlFor="email-notifications">
											Email Notifications
										</Label>
										<p className="text-sm text-muted-foreground">
											Receive notifications via email
										</p>
									</div>
									<Switch id="email-notifications" defaultChecked />
								</div>

								<div className="flex items-center justify-between">
									<div className="space-y-0.5">
										<Label htmlFor="workspace-updates">Workspace Updates</Label>
										<p className="text-sm text-muted-foreground">
											Get notified when changes happen to your workspaces
										</p>
									</div>
									<Switch id="workspace-updates" defaultChecked />
								</div>

								<div className="flex items-center justify-between">
									<div className="space-y-0.5">
										<Label htmlFor="team-updates">Team Updates</Label>
										<p className="text-sm text-muted-foreground">
											Get notified about team membership changes
										</p>
									</div>
									<Switch id="team-updates" defaultChecked />
								</div>
							</CardContent>
							<CardFooter>
								<Button>Save Changes</Button>
							</CardFooter>
						</Card>
					</TabsContent>

					<TabsContent value="security" className="space-y-4 mt-4">
						<Card>
							<CardHeader>
								<CardTitle>Security</CardTitle>
								<CardDescription>Manage your security settings</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="space-y-2">
									<Label htmlFor="current-password">Current Password</Label>
									<Input id="current-password" type="password" />
								</div>
								<div className="space-y-2">
									<Label htmlFor="new-password">New Password</Label>
									<Input id="new-password" type="password" />
								</div>
								<div className="space-y-2">
									<Label htmlFor="confirm-password">Confirm New Password</Label>
									<Input id="confirm-password" type="password" />
								</div>
							</CardContent>
							<CardFooter>
								<Button>Update Password</Button>
							</CardFooter>
						</Card>
					</TabsContent>
				</Tabs>
			</div>
		</DashboardLayout>
	);
}
