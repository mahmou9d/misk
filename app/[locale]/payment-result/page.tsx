import { PaymentPopup } from '@/components/layout/Paymentresult'
import React, { Suspense } from 'react'

const page = () => {
  return (
            <Suspense fallback={null}>
              <PaymentPopup />
            </Suspense>
  )
}

export default page