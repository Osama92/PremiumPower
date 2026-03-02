"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { getInitials, formatDateTime, cn } from "@/lib/utils"
import { ROLE_LABELS } from "@/lib/constants"
import { Send } from "lucide-react"
import type { Role } from "@/types"
import { toast } from "sonner"

interface Contact {
  id: string
  name: string
  role: string
  email: string
}

interface Message {
  id: string
  senderId: string
  receiverId: string
  content: string
  createdAt: Date | string
  sender: { id: string; name: string; role: string }
  receiver: { id: string; name: string; role: string }
}

interface Props {
  currentUserId: string
  contacts: Contact[]
  initialMessages: Message[]
}

export function MessagesClient({ currentUserId, contacts, initialMessages }: Props) {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(contacts[0] || null)
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [newMessage, setNewMessage] = useState("")
  const [sending, setSending] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  const threadMessages = messages.filter(
    (m) =>
      (m.senderId === currentUserId && m.receiverId === selectedContact?.id) ||
      (m.senderId === selectedContact?.id && m.receiverId === currentUserId)
  )

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [threadMessages.length])

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault()
    if (!newMessage.trim() || !selectedContact) return
    setSending(true)
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ receiverId: selectedContact.id, content: newMessage }),
      })
      const msg = await res.json()
      setMessages((prev) => [...prev, msg])
      setNewMessage("")
    } catch {
      toast.error("Failed to send message")
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="grid md:grid-cols-3 gap-4 h-[600px]">
      {/* Contacts list */}
      <Card className="md:col-span-1">
        <CardHeader className="p-3 pb-2">
          <p className="text-sm font-semibold text-[#1B3A5C]">Contacts</p>
        </CardHeader>
        <ScrollArea className="h-[520px]">
          <div className="p-2 space-y-1">
            {contacts.map((contact) => {
              const unread = messages.filter(
                (m) => m.senderId === contact.id && m.receiverId === currentUserId
              ).length

              return (
                <button
                  key={contact.id}
                  onClick={() => setSelectedContact(contact)}
                  className={cn(
                    "w-full flex items-center gap-3 p-2.5 rounded-lg text-left transition-colors",
                    selectedContact?.id === contact.id
                      ? "bg-[#1B3A5C] text-white"
                      : "hover:bg-gray-100"
                  )}
                >
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarFallback className={cn("text-xs font-bold", selectedContact?.id === contact.id ? "bg-white text-[#1B3A5C]" : "bg-[#1B3A5C] text-white")}>
                      {getInitials(contact.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{contact.name}</p>
                    <p className={cn("text-xs truncate", selectedContact?.id === contact.id ? "text-white/70" : "text-muted-foreground")}>
                      {ROLE_LABELS[contact.role as Role]}
                    </p>
                  </div>
                </button>
              )
            })}
            {contacts.length === 0 && (
              <p className="text-xs text-muted-foreground text-center py-8">No contacts</p>
            )}
          </div>
        </ScrollArea>
      </Card>

      {/* Chat area */}
      <Card className="md:col-span-2 flex flex-col">
        {selectedContact ? (
          <>
            <CardHeader className="p-3 pb-2 border-b">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-[#1B3A5C] text-white text-xs font-bold">
                    {getInitials(selectedContact.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-semibold">{selectedContact.name}</p>
                  <p className="text-xs text-muted-foreground">{ROLE_LABELS[selectedContact.role as Role]}</p>
                </div>
              </div>
            </CardHeader>
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-3">
                {threadMessages.map((msg) => {
                  const isMe = msg.senderId === currentUserId
                  return (
                    <div key={msg.id} className={cn("flex", isMe ? "justify-end" : "justify-start")}>
                      <div className={cn(
                        "max-w-[75%] rounded-2xl px-3 py-2 text-sm",
                        isMe ? "bg-[#1B3A5C] text-white rounded-br-sm" : "bg-gray-100 text-gray-800 rounded-bl-sm"
                      )}>
                        <p>{msg.content}</p>
                        <p className={cn("text-xs mt-0.5", isMe ? "text-white/60" : "text-gray-500")}>
                          {formatDateTime(msg.createdAt)}
                        </p>
                      </div>
                    </div>
                  )
                })}
                {threadMessages.length === 0 && (
                  <p className="text-xs text-muted-foreground text-center py-12">
                    Start a conversation with {selectedContact.name}
                  </p>
                )}
                <div ref={bottomRef} />
              </div>
            </ScrollArea>
            <div className="p-3 border-t">
              <form onSubmit={sendMessage} className="flex gap-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1"
                />
                <Button type="submit" disabled={sending || !newMessage.trim()} className="bg-[#1B3A5C]">
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
            Select a contact to start messaging
          </div>
        )}
      </Card>
    </div>
  )
}
