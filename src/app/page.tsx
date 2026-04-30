'use client'

import { useRouter } from 'next/navigation'
import { Smartphone, CheckCircle, Wallet, Shield, Lock, Eye } from 'lucide-react'
import ScrollReveal from '@/components/ScrollReveal'
import FAQ from '@/components/FAQ'
import Logo from '@/components/Logo'
import Footer from '@/components/Footer'
import ScrollProgressBar from '@/components/ScrollProgressBar'
import StickyCTA from '@/components/StickyCTA'
import LogoReveal from '@/components/LogoReveal'
import PhoneMockupLive from '@/components/PhoneMockupLive'
import BeeTrailScroll from '@/components/BeeTrailScroll'
import AmberParticleField from '@/components/AmberParticleField'
import TiltCard from '@/components/TiltCard'
import { useTimeGreeting } from '@/components/TimeGreeting'
import KineticHeadline from '@/components/KineticHeadline'
import EmpathyMode from '@/components/EmpathyMode'
import TorchCursor from '@/components/TorchCursor'

export default function LandingPage() {
  const router = useRouter()
  const { greeting, subtext } = useTimeGreeting()

  return (
    <div style={{
      fontFamily: "'DM Sans', sans-serif",
      background: '#0a0a0b',
      color: '#EDEBE7',
      overflowX: 'hidden',
      userSelect: 'none',
      position: 'relative',
    }}>
      <ScrollProgressBar />
      <style>{
