import { Search, Share, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface HeaderProps {
  documentName: string
  documentLoaded: boolean
}

export default function Header({ documentName, documentLoaded }: HeaderProps) {
  return (
    <header className="border-b">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <div className="font-semibold text-xl text-primary">
            <span className="flex items-center gap-2">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="24" height="24" rx="4" fill="#E65C2A" />
                <path d="M7 12H17M7 8H17M7 16H13" stroke="white" strokeWidth="2" strokeLinecap="round" />
              </svg>
              Humata
            </span>
          </div>

          {documentLoaded && (
            <div className="relative w-[400px]">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search" className="pl-8 w-full" />
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1">
            <Share className="h-4 w-4" />
            Share
          </Button>
          <Button variant="outline" size="sm" className="bg-primary text-white hover:bg-primary/90">
            Upgrade
          </Button>
          <Button variant="ghost" size="sm" className="gap-1">
            <Avatar className="h-6 w-6">
              <AvatarImage src="/placeholder.svg?height=32&width=32" />
              <AvatarFallback>AA</AvatarFallback>
            </Avatar>
            <span>Anas Aqeel</span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  )
}
