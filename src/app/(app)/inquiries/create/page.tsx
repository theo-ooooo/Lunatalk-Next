import { InquiryPageLayout } from "@/components/inquiry/layout/InquiryPageLayout";
import { CreateInquiryForm } from "./CreateInquiryForm";

interface Props {
  searchParams: Promise<{
    orderNumber?: string;
  }>;
}

export default async function CreateInquiryPage({ searchParams }: Props) {
  const { orderNumber } = await searchParams;
  const backHref = orderNumber ? `/orders/${orderNumber}` : "/inquiries";

  return (
    <InquiryPageLayout backHref={backHref} title="문의하기">
      <CreateInquiryForm orderNumber={orderNumber} />
    </InquiryPageLayout>
  );
}
