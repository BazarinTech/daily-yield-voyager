import * as React from "react"
import { useEffect, useMemo, useRef, useState } from "react"
import { motion, useAnimationFrame } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ArrowDownRight, ArrowUpRight } from "lucide-react"

/**
 * CryptoMarquee
 * - Smooth, infinitely-looping marquee for coins & prices
 * - Built with React + Tailwind + shadcn/ui + Framer Motion
 * - Mobile-friendly, SSR-safe, and pause-on-hover
 *
 * Usage:
 * <CryptoMarquee coins={coins} speed={60} direction="left" />
 *
 * Props:
 * - coins: Array<CoinTicker>
 * - speed: number (pixels per second)
 * - gap: number (px gap between items)
 * - direction: "left" | "right"
 * - pauseOnHover: boolean
 */

export type CoinTicker = {
  id: string
  name: string
  symbol: string
  price: number
  change24h: number // percent, e.g. -1.23
  iconUrl?: string
}

type Props = {
  coins?: CoinTicker[]
  speed?: number
  gap?: number
  direction?: "left" | "right"
  pauseOnHover?: boolean
}

const DEFAULT_COINS: CoinTicker[] = [
  { id: "btc", name: "Bitcoin", symbol: "BTC", price: 64321.12, change24h: +1.8, iconUrl: "https://cryptoicons.org/api/icon/btc/32" },
  { id: "eth", name: "Ethereum", symbol: "ETH", price: 3210.45, change24h: -0.6, iconUrl: "https://cryptoicons.org/api/icon/eth/32" },
  { id: "bnb", name: "BNB", symbol: "BNB", price: 572.33, change24h: +0.9, iconUrl: "https://cryptoicons.org/api/icon/bnb/32" },
  { id: "sol", name: "Solana", symbol: "SOL", price: 181.77, change24h: +3.1, iconUrl: "https://cryptoicons.org/api/icon/sol/32" },
  { id: "xrp", name: "XRP", symbol: "XRP", price: 0.64, change24h: -2.2, iconUrl: "https://cryptoicons.org/api/icon/xrp/32" },
  { id: "doge", name: "Dogecoin", symbol: "DOGE", price: 0.12, change24h: +4.5, iconUrl: "https://cryptoicons.org/api/icon/doge/32" },
  { id: "ada", name: "Cardano", symbol: "ADA", price: 0.51, change24h: +0.2, iconUrl: "https://cryptoicons.org/api/icon/ada/32" },
  { id: "ton", name: "Toncoin", symbol: "TON", price: 7.11, change24h: -1.4, iconUrl: "https://cryptoicons.org/api/icon/ton/32" },
  { id: "trx", name: "TRON", symbol: "TRX", price: 0.12, change24h: +0.7, iconUrl: "https://cryptoicons.org/api/icon/trx/32" },
  { id: "ltc", name: "Litecoin", symbol: "LTC", price: 85.9, change24h: -0.3, iconUrl: "https://cryptoicons.org/api/icon/ltc/32" },
]

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
  coins = DEFAULT_COINS,
  speed = 60, // px per second
  gap = 24,
  direction = "left",
  pauseOnHover = true,
}: Props) {
  // Duplicate the list to create a seamless loop
  const items = useMemo(() => [...coins, ...coins], [coins])

  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  const [contentWidth, setContentWidth] = useState(0)
  const [isHovering, setIsHovering] = useState(false)

  // Measure content width on mount & resize
  useEffect(() => {
    function measure() {
      if (!contentRef.current) return
      const w = contentRef.current.scrollWidth / 2 // width of one list (before duplication)
      setContentWidth(w)
    }
    measure()
    const ro = new ResizeObserver(measure)
    if (contentRef.current) ro.observe(contentRef.current)
    return () => ro.disconnect()
  }, [coins])

  // Imperative animation using useAnimationFrame for perfect, jitter-free loop
  const xRef = useRef(0)
  useAnimationFrame((_, delta) => {
    if (!containerRef.current || contentWidth === 0) return
    const dir = direction === "left" ? -1 : 1
    const pxPerMs = speed / 1000
    if (!(pauseOnHover && isHovering)) {
      xRef.current += dir * pxPerMs * delta
      // wrap when we scrolled one content width
      if (direction === "left" && xRef.current <= -contentWidth) xRef.current += contentWidth
      if (direction === "right" && xRef.current >= contentWidth) xRef.current -= contentWidth
      containerRef.current.style.setProperty("--ticker-x", `${xRef.current}px`)
    }
  })

  return (
    <div className="relative w-full select-none">
      {/* Edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent z-10" />

      <div
        ref={containerRef}
        className={cn(
          "[--ticker-x:0px] overflow-hidden w-full",
          pauseOnHover && "hover:[--ticker-paused:1]"
        )}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        aria-label="Live crypto prices ticker"
        role="marquee"
      >
        <motion.div
          ref={contentRef}
          className="flex items-center"
          // translateX controlled via CSS var for silky perf
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

/**
 * Optional: live data example (CoinGecko)
 * -------------------------------------
 * Replace DEFAULT_COINS by fetching in your page:
 *
 * const [coins, setCoins] = React.useState<CoinTicker[]>([])
 * useEffect(() => {
 *   fetch("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,binancecoin,solana,ripple,cardano,tron,litecoin,toncoin,dogecoin&price_change_percentage=24h")
 *     .then(r => r.json())
 *     .then((rows) => setCoins(rows.map((r:any) => ({
 *       id: r.id,
 *       name: r.name,
 *       symbol: r.symbol.toUpperCase(),
 *       price: r.current_price,
 *       change24h: r.price_change_percentage_24h_in_currency,
 *       iconUrl: r.image,
 *     }))))
 * }, [])
 *
 * <CryptoMarquee coins={coins} speed={80} />
 */
