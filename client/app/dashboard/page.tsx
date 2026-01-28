'use client';

import { useState } from 'react';
import { Navigation } from '@/components/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { mockOrders, mockProjects, mockUsers } from '@/lib/mock-data';
import {
  Menu,
  LayoutGrid,
  Package,
  Settings,
  ChevronRight,
  Calendar,
  DollarSign,
  Zap,
} from 'lucide-react';

type DashboardTab = 'overview' | 'projects' | 'orders' | 'account';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Mock current user
  const currentUser = mockUsers[0];
  const userProjects = mockProjects.slice(0, 2);
  const userOrders = mockOrders;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="flex h-[calc(100vh-64px)]">
        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? 'w-64' : 'w-0'
          } bg-secondary/50 border-r border-border transition-all duration-300 overflow-hidden`}
        >
          <nav className="p-6 space-y-4">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                activeTab === 'overview'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-foreground hover:bg-primary/10'
              }`}
            >
              <LayoutGrid className="w-5 h-5" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab('projects')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                activeTab === 'projects'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-foreground hover:bg-primary/10'
              }`}
            >
              <Zap className="w-5 h-5" />
              <span>My Projects</span>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                activeTab === 'orders'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-foreground hover:bg-primary/10'
              }`}
            >
              <Package className="w-5 h-5" />
              <span>My Orders</span>
            </button>

            <button
              onClick={() => setActiveTab('account')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                activeTab === 'account'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-foreground hover:bg-primary/10'
              }`}
            >
              <Settings className="w-5 h-5" />
              <span>Account</span>
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          {/* Mobile Menu Button */}
          <div className="sticky top-0 bg-background border-b border-border p-4 md:hidden">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-secondary rounded"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>

          <div className="p-8 max-w-6xl">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-8">
                  Welcome, {currentUser.first_name}!
                </h1>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-semibold text-muted-foreground">
                        Projects Submitted
                      </h3>
                      <Zap className="w-5 h-5 text-primary" />
                    </div>
                    <p className="text-3xl font-bold text-foreground">
                      {userProjects.length}
                    </p>
                  </Card>

                  <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-semibold text-muted-foreground">
                        Total Orders
                      </h3>
                      <Package className="w-5 h-5 text-accent" />
                    </div>
                    <p className="text-3xl font-bold text-foreground">
                      {userOrders.length}
                    </p>
                  </Card>

                  <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-semibold text-muted-foreground">
                        Total Spent
                      </h3>
                      <DollarSign className="w-5 h-5 text-primary" />
                    </div>
                    <p className="text-3xl font-bold text-foreground">
                      ${userOrders.reduce((sum, order) => sum + order.total_amount, 0).toFixed(2)}
                    </p>
                  </Card>
                </div>

                {/* Recent Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Recent Projects */}
                  <Card className="p-6">
                    <h2 className="text-xl font-bold text-foreground mb-4">
                      Recent Projects
                    </h2>
                    <div className="space-y-3">
                      {userProjects.map((project) => (
                        <div
                          key={project.id}
                          className="flex items-center justify-between p-3 bg-secondary/30 rounded"
                        >
                          <div>
                            <p className="font-semibold text-foreground text-sm">
                              {project.title}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {project.created_at.toLocaleDateString()}
                            </p>
                          </div>
                          <span
                            className={`text-xs font-semibold px-2 py-1 rounded ${
                              project.status === 'approved'
                                ? 'bg-accent/20 text-accent-foreground'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {project.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </Card>

                  {/* Recent Orders */}
                  <Card className="p-6">
                    <h2 className="text-xl font-bold text-foreground mb-4">
                      Recent Orders
                    </h2>
                    <div className="space-y-3">
                      {userOrders.slice(0, 3).map((order) => (
                        <div
                          key={order.id}
                          className="flex items-center justify-between p-3 bg-secondary/30 rounded"
                        >
                          <div>
                            <p className="font-semibold text-foreground text-sm">
                              Order #{order.id}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {order.created_at.toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-foreground">
                              ${order.total_amount.toFixed(2)}
                            </p>
                            <p className="text-xs text-muted-foreground capitalize">
                              {order.status}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              </div>
            )}

            {/* My Projects Tab */}
            {activeTab === 'projects' && (
              <div>
                <div className="flex items-center justify-between mb-8">
                  <h1 className="text-3xl font-bold text-foreground">My Projects</h1>
                  <Button>Submit New Project</Button>
                </div>

                <div className="space-y-4">
                  {userProjects.map((project) => (
                    <Card key={project.id} className="p-6">
                      <div className="flex items-start justify-between gap-6">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-foreground mb-2">
                            {project.title}
                          </h3>
                          <p className="text-muted-foreground mb-4 line-clamp-2">
                            {project.description}
                          </p>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {project.technologies.split(', ').map((tech, i) => (
                              <span
                                key={i}
                                className="text-xs bg-secondary px-2 py-1 rounded text-foreground"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Submitted: {project.created_at.toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <span
                            className={`text-sm font-semibold px-3 py-1 rounded-full block mb-4 ${
                              project.status === 'approved'
                                ? 'bg-accent/20 text-accent-foreground'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {project.status}
                          </span>
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* My Orders Tab */}
            {activeTab === 'orders' && (
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-8">My Orders</h1>

                <div className="space-y-4">
                  {userOrders.map((order) => (
                    <Card key={order.id} className="p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                          <p className="font-bold text-foreground text-lg">
                            Order #{order.id}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Placed on: {order.created_at.toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">Total</p>
                            <p className="text-2xl font-bold text-primary">
                              ${order.total_amount.toFixed(2)}
                            </p>
                          </div>
                          <div className="text-right">
                            <span
                              className={`text-sm font-semibold px-3 py-1 rounded-full block ${
                                order.status === 'completed'
                                  ? 'bg-accent/20 text-accent-foreground'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}
                            >
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Account Tab */}
            {activeTab === 'account' && (
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-8">Account Settings</h1>

                <Card className="p-8 max-w-2xl">
                  <div className="space-y-6">
                    <div>
                      <label className="text-sm font-semibold text-muted-foreground">
                        First Name
                      </label>
                      <p className="text-lg text-foreground font-semibold mt-2">
                        {currentUser.first_name}
                      </p>
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-muted-foreground">
                        Last Name
                      </label>
                      <p className="text-lg text-foreground font-semibold mt-2">
                        {currentUser.last_name}
                      </p>
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-muted-foreground">
                        Email
                      </label>
                      <p className="text-lg text-foreground font-semibold mt-2">
                        {currentUser.email}
                      </p>
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-muted-foreground">
                        Member Since
                      </label>
                      <p className="text-lg text-foreground font-semibold mt-2">
                        {currentUser.created_at.toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>

                    <div className="pt-6 border-t border-border">
                      <Button className="mr-3">Edit Profile</Button>
                      <Button variant="outline">Change Password</Button>
                    </div>
                  </div>
                </Card>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
