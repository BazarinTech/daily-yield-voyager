"use client"

import * as React from "react"
import { useEffect, useMemo, useRef, useState } from "react"
import { motion, useAnimationFrame } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ArrowDownRight, ArrowUpRight } from "lucide-react"

export type CoinTicker = {
  id: string
  name: string
  symbol: string
  price: number
  change24h: number
  iconUrl?: string
}

type CoinGeckoCoin = {
  id: string
  name: string
  symbol: string
  current_price: number
  price_change_percentage_24h_in_currency: number
  image: string
}

type Props = {
  speed?: number
  gap?: number
  direction?: "left" | "right"
  pauseOnHover?: boolean
}

function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ")
}

function formatCurrency(n: number) {
  if (n >= 1000) return n.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 })
  return n.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 4 })
}

function TickerPill({ coin, gap = 24 }: { coin: CoinTicker; gap?: number }) {
  const up = coin.change24h >= 0
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Card
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-2xl shadow-sm border",
              "backdrop-blur-sm bg-white/60 dark:bg-zinc-900/60"
            )}
            style={{ marginRight: gap }}
          >
            {/* Icon */}
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
              {coin.iconUrl ? (
                <img src={coin.iconUrl} alt={coin.symbol} className="h-6 w-6" />
              ) : (
                <span className="text-xs font-semibold">{coin.symbol[0]}</span>
              )}
            </span>

            {/* Name & Price */}
            <div className="flex items-baseline gap-2">
              <span className="font-medium text-sm">
                {coin.symbol}
                <span className="ml-2 hidden sm:inline text-muted-foreground">{coin.name}</span>
              </span>
              <span className="text-sm tabular-nums">{formatCurrency(coin.price)}</span>
            </div>

            {/* Change badge */}
            <Badge
              variant={up ? "default" : "destructive"}
              className={cn(
                "ml-1 gap-1 rounded-full px-2 py-1 text-[11px] font-semibold",
                up ? "bg-emerald-500 hover:bg-emerald-500/90" : "",
              )}
            >
              {up ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
              {Math.abs(coin.change24h).toFixed(2)}%
            </Badge>
          </Card>
        </TooltipTrigger>
        <TooltipContent>
          <div className="text-xs">
            <div className="font-medium">{coin.name} ({coin.symbol})</div>
            <div>Price: {formatCurrency(coin.price)}</div>
            <div>24h: {coin.change24h.toFixed(2)}%</div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default function CryptoMarquee({
  speed = 60,
  gap = 24,
  direction = "left",
  pauseOnHover = true,
}: Props) {
  const [coins, setCoins] = useState<CoinTicker[]>([])

useEffect(() => {
  async function fetchCoins() {
    const res = await fetch(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,binancecoin,solana,ripple,cardano,tron,litecoin,toncoin,dogecoin&price_change_percentage=24h"
    )
    const rows: CoinGeckoCoin[] = await res.json()
    setCoins(
      rows.map((r) => ({
        id: r.id,
        name: r.name,
        symbol: r.symbol.toUpperCase(),
        price: r.current_price,
        change24h: r.price_change_percentage_24h_in_currency,
        iconUrl: r.image,
      }))
    )
  }
  fetchCoins()
  const interval = setInterval(fetchCoins, 60000)
  return () => clearInterval(interval)
}, [])


  const items = useMemo(() => [...coins, ...coins], [coins])

  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  const [contentWidth, setContentWidth] = useState(0)
  const [isHovering, setIsHovering] = useState(false)

  useEffect(() => {
    function measure() {
      if (!contentRef.current) return
      const w = contentRef.current.scrollWidth / 2
      setContentWidth(w)
    }
    measure()
    const ro = new ResizeObserver(measure)
    if (contentRef.current) ro.observe(contentRef.current)
    return () => ro.disconnect()
  }, [coins])

  const xRef = useRef(0)
  useAnimationFrame((_, delta) => {
    if (!containerRef.current || contentWidth === 0) return
    const dir = direction === "left" ? -1 : 1
    const pxPerMs = speed / 1000
    if (!(pauseOnHover && isHovering)) {
      xRef.current += dir * pxPerMs * delta
      if (direction === "left" && xRef.current <= -contentWidth) xRef.current += contentWidth
      if (direction === "right" && xRef.current >= contentWidth) xRef.current -= contentWidth
      containerRef.current.style.setProperty("--ticker-x", `${xRef.current}px`)
    }
  })

  return (
    <div className="relative w-full select-none">
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent z-10" />

      <div
        ref={containerRef}
        className={cn("[--ticker-x:0px] overflow-hidden w-full", pauseOnHover && "hover:[--ticker-paused:1]")}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        aria-label="Live crypto prices ticker"
        role="marquee"
      >
        <motion.div
          ref={contentRef}
          className="flex items-center"
          style={{ transform: "translateX(var(--ticker-x))" }}
        >
          {items.map((c, i) => (
            <TickerPill key={`${c.id}-${i}`} coin={c} gap={gap} />
          ))}
        </motion.div>
      </div>
    </div>
  )
}
