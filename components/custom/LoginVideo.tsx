"use client";
import React from 'react'

const LoginVideo = () => {
  return (
    <video autoPlay loop muted className="absolute inset-0 h-full w-full object-cover">
    <source src="/assets/videos/login.mp4" type="video/mp4" />
  </video>
  )
}

export default LoginVideo