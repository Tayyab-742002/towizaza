import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

interface SuccessHandlerProps {
  onValidOrder: (orderId: string) => void;
  onInvalidOrder: () => void;
}

/**
 * Component that validates the checkout success token against the database
 * Can be used on the success page for additional security verification
 */
export function SuccessHandler({
  onValidOrder,
  onInvalidOrder,
}: SuccessHandlerProps) {
  const searchParams = useSearchParams();
  const [isValidating, setIsValidating] = useState(true);

  useEffect(() => {
    const validateOrder = async () => {
      try {
        const token = searchParams.get("token");

        if (!token) {
          onInvalidOrder();
          return;
        }

        // Call API to validate the order with the provided token
        const response = await fetch(`/api/orders/validate?token=${token}`, {
          method: "GET",
        });

        if (response.ok) {
          const data = await response.json();
          // If validation is successful, call the success callback
          onValidOrder(data.orderId);
        } else {
          // If validation fails, call the failure callback
          onInvalidOrder();
        }
      } catch (error) {
        console.error("Error validating order:", error);
        onInvalidOrder();
      } finally {
        setIsValidating(false);
      }
    };

    validateOrder();
  }, [searchParams, onValidOrder, onInvalidOrder]);

  // This component doesn't render anything visible
  return null;
}
