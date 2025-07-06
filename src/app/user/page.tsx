"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BottomDrawer,
  BottomDrawerContent,
  BottomDrawerHeader,
  BottomDrawerTitle,
  BottomDrawerTrigger,
  BottomDrawerDescription,
} from "@/components/ui/bottom-drawer";

import {
  Calendar,
  CarFront,
  FileText,
  User,
  MapPin,
  Mail,
  CreditCard,
  Car,
} from "lucide-react";

import Image from 'next/image';

interface Policy {
  _id: string;
  policyNumber: string;
  price: number;
  status: string;
  startDate: string;
  endDate: string;
  vehicleInfo: {
    make: string;
    model: string;
    colour: string;
    yearOfManufacture: number;
    vehicleRegistration?: string;
    registeredKeeper?: string;
    topSpeed?: string;
    acceleration?: string;
    gearbox?: string;
    power?: string;
    maxTorque?: string;
    engineCapacity?: string;
    cylinders?: number;
    fuelType?: string;
    consumptionCity?: string;
    consumptionExtraUrban?: string;
    consumptionCombined?: string;
    co2Emission?: string;
    co2Label?: string;
    motExpiryDate?: string;
    motPassRate?: string;
    motPassed?: number;
    motFailed?: number;
    totalAdviceItems?: number;
    totalItemsFailed?: number;
    taxStatus?: string;
    taxDue?: string;
    ncapRating?: {
      adult?: string;
      children?: string;
      pedestrian?: string;
      safetySystems?: string;
      overall?: string;
    };
    dimensions?: {
      width?: string;
      height?: string;
      length?: string;
      wheelBase?: string;
      maxAllowedWeight?: string;
    };
    fuelTankCapacity?: string;
    fuelDelivery?: string;
    numberOfDoors?: number;
    numberOfSeats?: number;
    numberOfAxles?: number;
    engineNumber?: string;
  };
}

interface User {
  fullName: string;
  email: string;
  address: string;
  dateOfBirth: string;
}

export default function UserDashboard() {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
    fetchUserData();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/auth/me");
      if (response.ok) {
        const data = await response.json();
        if (data.user.role !== "user") {
          router.push("/");
          return;
        }
      } else {
        router.push("/");
      }
    } catch (error) {
      router.push("/");
    }
  };

  const fetchUserData = async () => {
    try {
      const response = await fetch("/api/user/policies");
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setPolicies(data.policies || []);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePolicyClick = (policyId: string) => {
    router.push(`/user/policy/${policyId}`);
  };

  const getStatusColor = (status: string, endDate: string) => {
    const today = new Date();
    const expiry = new Date(endDate);
    const daysUntilExpiry = Math.ceil(
      (expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (status === "expired" || daysUntilExpiry < 0)
      return "bg-gray-500 text-white";
    if (daysUntilExpiry <= 30) return "bg-amber-500 text-white";
    if (status === "active") return "bg-green-500 text-white";
    return "bg-gray-500 text-white";
  };

  const getStatusText = (status: string, endDate: string) => {
    const today = new Date();
    const expiry = new Date(endDate);
    const daysUntilExpiry = Math.ceil(
      (expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (status === "expired" || daysUntilExpiry < 0) return "EXPIRED";
    if (daysUntilExpiry <= 30) return "DUE TO RENEW";
    if (status === "active") return "ACTIVE";
    return status.toUpperCase();
  };

  const activePolicies = policies.filter((p) => {
    const today = new Date();
    const expiry = new Date(p.endDate);
    return p.status === "active" && expiry >= today;
  });

  const inactivePolicies = policies.filter((p) => {
    const today = new Date();
    const expiry = new Date(p.endDate);
    return p.status === "expired" || expiry < today;
  });

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', background: '#F6F9FE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F6F9FE', position: 'relative', overflow: 'hidden' }}>
      {/* SVG Car Illustration (bottom right, responsive) */}
      <svg viewBox="0 0 320 120" style={{ position: 'absolute', bottom: 0, right: 0, width: '70vw', maxWidth: 340, height: 'auto', zIndex: 0, opacity: 0.18, pointerEvents: 'none' }}>
        <ellipse cx="160" cy="110" rx="140" ry="10" fill="#2563eb" opacity=".12" />
        <rect x="40" y="60" width="240" height="30" rx="12" fill="#2563eb" />
        <rect x="60" y="40" width="200" height="30" rx="14" fill="#FF9100" />
        <circle cx="80" cy="100" r="18" fill="#fff" stroke="#2563eb" strokeWidth="4" />
        <circle cx="240" cy="100" r="18" fill="#fff" stroke="#2563eb" strokeWidth="4" />
        <rect x="120" y="30" width="80" height="30" rx="12" fill="#2563eb" />
        <rect x="140" y="20" width="40" height="18" rx="8" fill="#fff" />
      </svg>
      <main style={{ position: 'relative', zIndex: 1, maxWidth: 600, margin: '0 auto', padding: '32px 8px 24px 8px', width: '100%' }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#2563eb', marginBottom: 24, letterSpacing: 1, textAlign: 'center' }}>Your Policies</h1>
        {/* Active Policies */}
        {activePolicies.length > 0 && (
          <div style={{ marginBottom: 28 }}>
            <h2 style={{ fontSize: 16, fontWeight: 600, color: '#222', marginBottom: 12 }}>Active policies</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {activePolicies.map((policy) => (
                <div key={policy._id} style={{ background: 'linear-gradient(120deg, #2563eb 80%, #6fa1ff 100%)', borderRadius: 18, boxShadow: '0 2px 12px rgba(37,99,235,0.07)', padding: 0, width: '100%', cursor: 'pointer', border: 'none', display: 'flex', flexDirection: 'row', alignItems: 'center', minHeight: 120, position: 'relative', overflow: 'hidden' }} onClick={() => handlePolicyClick(policy._id)}>
                  {/* Car SVG and number plate */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minWidth: 90, padding: '0 18px' }}>
                    {/* Car SVG */}
                    <svg width="56" height="40" viewBox="0 0 56 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="4" y="18" width="48" height="14" rx="6" fill="#fff"/>
                      <rect x="8" y="10" width="40" height="14" rx="7" fill="#6fa1ff"/>
                      <ellipse cx="14" cy="34" rx="5" ry="5" fill="#fff" stroke="#2563eb" strokeWidth="2"/>
                      <ellipse cx="42" cy="34" rx="5" ry="5" fill="#fff" stroke="#2563eb" strokeWidth="2"/>
                      <rect x="20" y="6" width="16" height="8" rx="4" fill="#fff"/>
                      <rect x="24" y="2" width="8" height="6" rx="3" fill="#2563eb"/>
                    </svg>
                    {/* Number plate */}
                    {policy.vehicleInfo?.vehicleRegistration && (
                      <div style={{ background: '#FFD600', color: '#111', fontWeight: 700, fontSize: 13, borderRadius: 4, border: '2px solid #222', padding: '2px 10px', marginTop: 6, letterSpacing: 1, boxShadow: '0 1px 2px #0002' }}>
                        {policy.vehicleInfo.vehicleRegistration}
                      </div>
                    )}
                  </div>
                  {/* Policy details */}
                  <div style={{ flex: 1, padding: '18px 18px 18px 0', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div style={{ color: '#b3d1ff', fontWeight: 500, fontSize: 14, marginBottom: 2 }}>Policy No. {policy.policyNumber}</div>
                    <div style={{ fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 8 }}>{policy.vehicleInfo.make} {policy.vehicleInfo.model}</div>
                    <div style={{ display: 'flex', gap: 24, fontSize: 15, color: '#fff', marginBottom: 8 }}>
                    <div>
                        <div style={{ color: '#e0eaff', fontWeight: 500, fontSize: 13 }}>Cover starts</div>
                        <div style={{ fontWeight: 700, fontSize: 16 }}>{new Date(policy.startDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
                    </div>
                    <div>
                        <div style={{ color: '#e0eaff', fontWeight: 500, fontSize: 13 }}>Cover ends</div>
                        <div style={{ fontWeight: 700, fontSize: 16 }}>{new Date(policy.endDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
                      </div>
                    </div>
                    <button style={{ alignSelf: 'flex-end', background: '#FF9100', color: '#fff', border: 'none', borderRadius: 18, padding: '8px 22px', fontWeight: 700, fontSize: 15, marginTop: 4, boxShadow: '0 2px 8px #FF910022', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                      View policy <svg width="18" height="18" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {/* Inactive Policies */}
        {inactivePolicies.length > 0 && (
          <div style={{ marginBottom: 28 }}>
            <h2 style={{ fontSize: 16, fontWeight: 600, color: '#888', marginBottom: 12 }}>Inactive policies</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {inactivePolicies.map((policy) => (
                <div key={policy._id} style={{ background: '#f7f8f9', borderRadius: 16, boxShadow: '0 2px 8px rgba(37,99,235,0.04)', padding: 18, width: '100%', cursor: 'pointer', border: '1px solid #e6e9eb', display: 'flex', flexDirection: 'column', gap: 8 }} onClick={() => handlePolicyClick(policy._id)}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <span style={{ color: '#b9c4c9', fontWeight: 500, fontSize: 14 }}>{policy.policyNumber}</span>
                    <span style={{ background: '#b9c4c9', color: '#fff', borderRadius: 14, padding: '2px 12px', fontSize: 12, fontWeight: 600 }}>EXPIRED</span>
                  </div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: '#888', marginBottom: 2 }}>{policy.vehicleInfo.make} {policy.vehicleInfo.model}</div>
                  <div style={{ display: 'flex', gap: 16, fontSize: 13, color: '#888' }}>
                    <div>
                      <div style={{ color: '#b9c4c9', fontWeight: 500 }}>Start</div>
                      <div>{new Date(policy.startDate).toLocaleDateString('en-GB')}</div>
                    </div>
                    <div>
                      <div style={{ color: '#b9c4c9', fontWeight: 500 }}>End</div>
                      <div>{new Date(policy.endDate).toLocaleDateString('en-GB')}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {/* No Policies */}
        {policies.length === 0 && (
          <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 8px rgba(37,99,235,0.04)', padding: 32, textAlign: 'center', marginTop: 24, width: '100%' }}>
            {/* Simple white SVG profile icon */}
            <svg width="48" height="48" viewBox="0 0 64 64" fill="none" style={{ margin: '0 auto 12px auto', display: 'block' }} xmlns="http://www.w3.org/2000/svg">
              <circle cx="32" cy="32" r="32" fill="#fff" />
              <circle cx="32" cy="24" r="10" fill="#2563eb" fillOpacity="0.12" />
              <ellipse cx="32" cy="44" rx="16" ry="8" fill="#2563eb" fillOpacity="0.08" />
              <circle cx="32" cy="24" r="7" fill="#2563eb" />
            </svg>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#2563eb', marginBottom: 6 }}>No policies found</h3>
            <p style={{ fontSize: 14, color: '#888' }}>You don't have any insurance policies yet.</p>
          </div>
        )}
      </main>
      {/* Floating Profile Button (bottom right, above nav, always visible) */}
      <BottomDrawer>
        <BottomDrawerTrigger asChild>
          <button style={{ position: 'fixed', bottom: 80, right: 20, height: 56, width: 56, borderRadius: '50%', background: '#2563eb', color: '#fff', boxShadow: '0 4px 16px rgba(37,99,235,0.15)', border: 'none', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, cursor: 'pointer' }}>
            {/* Simple white SVG profile icon */}
            <svg width="32" height="32" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="32" cy="32" r="32" fill="#fff" />
              <circle cx="32" cy="24" r="10" fill="#2563eb" fillOpacity="0.12" />
              <ellipse cx="32" cy="44" rx="16" ry="8" fill="#2563eb" fillOpacity="0.08" />
              <circle cx="32" cy="24" r="7" fill="#2563eb" />
            </svg>
          </button>
        </BottomDrawerTrigger>
        <BottomDrawerContent>
          <BottomDrawerHeader>
            <BottomDrawerTitle style={{ color: '#2563eb', fontWeight: 700, fontSize: 24 }}>Profile</BottomDrawerTitle>
            <BottomDrawerDescription style={{ color: '#888', fontSize: 16 }}>View your personal details and policy summary</BottomDrawerDescription>
          </BottomDrawerHeader>
          <div style={{ padding: '0 32px 32px 32px', marginTop: 12 }}>
            {/* User Details */}
            {user && (
              <div style={{ background: '#fff', borderRadius: 18, boxShadow: '0 2px 12px rgba(37,99,235,0.04)', padding: 32, marginBottom: 32 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 24 }}>
                  <Image src="/user-account.svg" alt="User" width={48} height={48} />
                    <div>
                    <div style={{ fontWeight: 700, fontSize: 20, color: '#2563eb' }}>{user.fullName}</div>
                    <div style={{ color: '#888', fontSize: 16 }}>{user.email}</div>
                  </div>
                    </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, fontSize: 16 }}>
                  <div style={{ flex: '1 1 180px' }}>
                    <div style={{ color: '#b9c4c9', fontWeight: 500 }}>Address</div>
                    <div style={{ fontWeight: 600, color: '#222' }}>{user.address}</div>
                  </div>
                  <div style={{ flex: '1 1 180px' }}>
                    <div style={{ color: '#b9c4c9', fontWeight: 500 }}>Date of Birth</div>
                    <div style={{ fontWeight: 600, color: '#222' }}>{new Date(user.dateOfBirth).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                  </div>
                  <div style={{ flex: '1 1 180px' }}>
                    <div style={{ color: '#b9c4c9', fontWeight: 500 }}>Vehicle Registration</div>
                    <div style={{ fontWeight: 600, color: '#222' }}>{policies[0]?.vehicleInfo?.vehicleRegistration || 'Will be added'}</div>
                  </div>
                  <div style={{ flex: '1 1 180px' }}>
                    <div style={{ color: '#b9c4c9', fontWeight: 500 }}>Registered Keeper</div>
                    <div style={{ fontWeight: 600, color: '#222' }}>{policies[0]?.vehicleInfo?.registeredKeeper || 'Will be added'}</div>
                  </div>
                </div>
              </div>
            )}
            {/* Policy Summary */}
            <div style={{ background: '#f7f8f9', borderRadius: 18, boxShadow: '0 2px 12px rgba(37,99,235,0.04)', padding: 32 }}>
              <div style={{ fontWeight: 700, fontSize: 20, color: '#2563eb', marginBottom: 18 }}>Policy Summary</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, fontSize: 16 }}>
                <div style={{ flex: '1 1 180px' }}>
                  <div style={{ color: '#b9c4c9', fontWeight: 500 }}>Total Premium Paid</div>
                  <div style={{ fontWeight: 700, color: '#222', fontSize: 18 }}>£{policies.reduce((total, p) => total + p.price, 0).toLocaleString()}</div>
                </div>
                <div style={{ flex: '1 1 180px' }}>
                  <div style={{ color: '#b9c4c9', fontWeight: 500 }}>Active Policies</div>
                  <div style={{ fontWeight: 700, color: '#222', fontSize: 18 }}>{activePolicies.length}</div>
                </div>
                <div style={{ flex: '1 1 180px' }}>
                  <div style={{ color: '#b9c4c9', fontWeight: 500 }}>Total Policies</div>
                  <div style={{ fontWeight: 700, color: '#222', fontSize: 18 }}>{policies.length}</div>
                </div>
                {policies.length > 0 && (
                  <div style={{ flex: '1 1 180px' }}>
                    <div style={{ color: '#b9c4c9', fontWeight: 500 }}>Latest Policy</div>
                    <div style={{ fontWeight: 700, color: '#222' }}>{policies[0]?.vehicleInfo?.make} {policies[0]?.vehicleInfo?.model}</div>
                    <div style={{ color: '#888', fontSize: 15 }}>{policies[0] && new Date(policies[0].startDate).toLocaleDateString('en-GB')} - {policies[0] && new Date(policies[0].endDate).toLocaleDateString('en-GB')}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </BottomDrawerContent>
      </BottomDrawer>
    </div>
  );
}
