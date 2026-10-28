import { MessageCircle, Phone } from "lucide-react";

export default function DriverActions({
  driver,
  onCall,
  onMessage,
}) {
  const phone =
    driver?.phone ||
    driver?.user?.phone ||
    driver?.mobile ||
    "";

  const canContact = Boolean(phone);

  return (
    <section className="rounded-[18px] border border-neutral-200 bg-white p-4">
      <p className="mb-3 text-[12px] font-medium leading-4 text-neutral-500">
        Driver actions
      </p>

      <div className="flex gap-2">
        {/* Call */}
        <button
          type="button"
          disabled={!canContact}
          onClick={() => onCall?.(phone)}
          className="
            flex
            h-[42px]
            flex-1
            items-center
            justify-center
            gap-2
            rounded-[12px]
            border
            border-neutral-200
            bg-white
            text-[12px]
            font-medium
            leading-4
            text-neutral-800
            transition
            hover:bg-neutral-50
            disabled:cursor-not-allowed
            disabled:opacity-40
          "
        >
          <Phone
            size={15}
            strokeWidth={1.8}
          />

          Call
        </button>

        {/* Message */}
        <button
          type="button"
          disabled={!canContact}
          onClick={() => onMessage?.(phone)}
          className="
            flex
            h-[42px]
            flex-1
            items-center
            justify-center
            gap-2
            rounded-[12px]
            border
            border-neutral-200
            bg-white
            text-[12px]
            font-medium
            leading-4
            text-neutral-800
            transition
            hover:bg-neutral-50
            disabled:cursor-not-allowed
            disabled:opacity-40
          "
        >
          <MessageCircle
            size={15}
            strokeWidth={1.8}
          />

          Message
        </button>
      </div>
    </section>
  );
}