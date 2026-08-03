'use client';

import { Card } from '@/components/UI/Card';
import { Badge } from '@/components/UI/Badge';
import {
  Shield,
  Heart,
  GraduationCap,
  Plane,
  Home,
  CheckCircle,
  Users,
  DollarSign,
  TrendingUp
} from 'lucide-react';

export default function BenefitsPage() {
  const benefits = [
    { id: '1', name: 'Health Insurance', icon: Heart, enrolled: 118, total: 124, cost: 48600, type: 'Insurance', status: 'active' },
    { id: '2', name: '401(k) Retirement', icon: DollarSign, enrolled: 105, total: 124, cost: 62400, type: 'Retirement', status: 'active' },
    { id: '3', name: 'Paid Time Off', icon: Plane, enrolled: 124, total: 124, cost: 0, type: 'Time Off', status: 'active' },
    { id: '4', name: 'Learning & Development', icon: GraduationCap, enrolled: 89, total: 124, cost: 24000, type: 'Development', status: 'active' },
    { id: '5', name: 'Dental & Vision', icon: Shield, enrolled: 112, total: 124, cost: 18600, type: 'Insurance', status: 'active' },
    { id: '6', name: 'Remote Work Stipend', icon: Home, enrolled: 95, total: 124, cost: 19000, type: 'Stipend', status: 'active' },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return <Badge variant="success">Active</Badge>;
      case 'paused': return <Badge variant="warning">Paused</Badge>;
      default: return <Badge variant="default">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-ink">Benefits</h1>
        <p className="text-ink-muted mt-2">Employee benefits and perks administration</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 bg-surface border border-border">
          <Shield className="h-8 w-8 text-ink mb-3" />
          <p className="text-sm text-ink-muted">Active Benefits</p>
          <p className="text-3xl font-bold text-ink mt-1">{benefits.length}</p>
        </Card>
        <Card className="p-6 bg-surface border border-border">
          <Users className="h-8 w-8 text-ink mb-3" />
          <p className="text-sm text-ink-muted">Total Enrollments</p>
          <p className="text-3xl font-bold text-ink mt-1">643</p>
        </Card>
        <Card className="p-6 bg-surface border border-border">
          <DollarSign className="h-8 w-8 text-ink mb-3" />
          <p className="text-sm text-ink-muted">Monthly Cost</p>
          <p className="text-3xl font-bold text-ink mt-1">$172.6K</p>
        </Card>
        <Card className="p-6 bg-surface border border-border">
          <TrendingUp className="h-8 w-8 text-success mb-3" />
          <p className="text-sm text-ink-muted">Avg Participation</p>
          <p className="text-3xl font-bold text-ink mt-1">86%</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {benefits.map(benefit => {
          const Icon = benefit.icon;
          const pct = Math.round((benefit.enrolled / benefit.total) * 100);
          return (
            <Card key={benefit.id} className="p-6 bg-surface border border-border hover:border-border-strong transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-brand-mist rounded-lg">
                  <Icon className="h-5 w-5 text-brand" />
                </div>
                {getStatusBadge(benefit.status)}
              </div>
              <h3 className="text-lg font-semibold text-ink mb-1">{benefit.name}</h3>
              <p className="text-sm text-ink-muted mb-4">{benefit.type}</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-ink-muted">Enrolled</span>
                  <span className="text-ink font-medium">{benefit.enrolled}/{benefit.total}</span>
                </div>
                <div className="w-full bg-bg-muted rounded-full h-2">
                  <div
                    className="h-2 rounded-full bg-brand-mist"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <p className="text-xs text-ink-muted text-right">{pct}% participation</p>
              </div>
              
              {benefit.cost > 0 && (
                <div className="pt-4 border-t border-border flex items-center justify-between">
                  <span className="text-sm text-ink-muted">Monthly Cost</span>
                  <span className="text-ink font-semibold">${(benefit.cost / 1000).toFixed(1)}K</span>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
