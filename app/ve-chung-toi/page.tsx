import { Button } from "@/components/ui/button"
import { CheckCircle, ChevronRight, Users, Wrench, Award, Clock } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import prisma from "@/lib/db"
import TeamMembers from "@/components/about/team-members"
import TestimonialsServer from "@/components/about/testimonials-server"
import { Suspense } from "react"
import type { Metadata } from "next"
import Script from "next/script"

export const metadata: Metadata = {
  title: "Về Chúng Tôi | Hoàng Trí Moto",
  description: "Tìm hiểu về Hoàng Trí Moto - Dịch vụ sửa chữa, bảo dưỡng và độ xe mô tô chuyên nghiệp tại Đắk Lắk",
  openGraph: {
    title: "Về Chúng Tôi | Hoàng Trí Moto",
    description: "Tìm hiểu về Hoàng Trí Moto - Dịch vụ sửa chữa, bảo dưỡng và độ xe mô tô chuyên nghiệp tại Đắk Lắk",
    type: "website",
  }
}

// Revalidate page every 24 hours
export const revalidate = 86400

interface About {
  id: string;
  title: string;
  content: string;
  mission?: string;
  vision?: string;
  history?: string;
  createdAt: Date;
  updatedAt: Date;
  images?: {
    id: string;
    url: string;
    alt?: string;
  }[];
}

async function getAboutData() {
  try {
    const about = await prisma.about.findFirst({
      include: {
        images: true,
      },
    });
    return about;
  } catch (error) {
    console.error("Error fetching about data:", error);
    return null;
  }
}

// Định nghĩa các giá trị cốt lõi
const values = [
  {
    icon: <Users className="h-12 w-12 text-red-600" />,
    title: "Khách Hàng Là Trọng Tâm",
    description: "Chúng tôi luôn đặt nhu cầu và sự hài lòng của khách hàng lên hàng đầu trong mọi hoạt động.",
  },
  {
    icon: <Wrench className="h-12 w-12 text-red-600" />,
    title: "Chất Lượng Vượt Trội",
    description: "Cam kết mang đến dịch vụ sửa chữa và sản phẩm chất lượng cao nhất cho khách hàng.",
  },
  {
    icon: <Award className="h-12 w-12 text-red-600" />,
    title: "Chuyên Nghiệp & Uy Tín",
    description: "Đội ngũ nhân viên được đào tạo chuyên nghiệp, làm việc với tinh thần trách nhiệm cao.",
  },
  {
    icon: <Clock className="h-12 w-12 text-red-600" />,
    title: "Nhanh Chóng & Hiệu Quả",
    description: "Tối ưu hóa quy trình làm việc để đảm bảo thời gian sửa chữa nhanh chóng và hiệu quả.",
  },
];

export default async function AboutUsPage() {
  return (
    <div className="min-h-screen bg-black pt-24">
      {/* Schema Markup (JSON-LD) cho trang Về chúng tôi */}
      <Script id="about-schema" type="application/ld+json">
        {`
          {
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Hoàng Trí Moto",
            "url": "https://hoangtrimoto.com",
            "logo": "https://hoangtrimoto.com/logo.png",
            "description": "Dịch vụ sửa chữa, bảo dưỡng và độ xe mô tô chuyên nghiệp tại Đắk Lắk",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "123 Nguyễn Văn Linh",
              "addressLocality": "Buôn Ma Thuột",
              "addressRegion": "Đắk Lắk",
              "postalCode": "630000",
              "addressCountry": "VN"
            },
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "+84905678910",
              "contactType": "customer service"
            },
            "sameAs": [
              "https://facebook.com/hoangtrimoto",
              "https://instagram.com/hoangtrimoto",
              "https://youtube.com/hoangtrimoto"
            ]
          }
        `}
      </Script>
      <div className="container mx-auto px-4 py-16">
        {/* Breadcrumb */}
        <div className="mb-8 flex items-center text-sm text-gray-400">
          <Link href="/" className="hover:text-red-600">
            Trang Chủ
          </Link>
          <ChevronRight className="mx-2 h-4 w-4" />
          <span className="text-white">Về Chúng Tôi</span>
        </div>

        {/* Hero Section */}
        <Suspense fallback={<div className="h-96 w-full animate-pulse bg-zinc-800 rounded-lg"></div>}>
          <AboutHeroSection />
        </Suspense>

        {/* Our Values */}
        <div className="mb-16">
          <h2 className="mb-12 text-center text-3xl font-bold uppercase">Giá Trị Cốt Lõi</h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value, index) => (
              <div key={index} className="rounded-lg bg-zinc-900 p-6 text-center">
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-zinc-800">
                  {value.icon}
                </div>
                <h3 className="mb-3 text-xl font-bold">{value.title}</h3>
                <p className="text-gray-400">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Phần Đội Ngũ được tách thành component riêng */}
        <Suspense fallback={<div className="h-80 w-full animate-pulse bg-zinc-800 rounded-lg"></div>}>
          <TeamMembers />
        </Suspense>

        {/* Phần Đánh Giá Khách Hàng */}
        <Suspense fallback={<div className="h-80 w-full animate-pulse bg-zinc-800 rounded-lg"></div>}>
          <TestimonialsServer />
        </Suspense>
      </div>
    </div>
  )
}

// Tách phần Hero Section thành component riêng để sử dụng Suspense
async function AboutHeroSection() {
  // Lấy dữ liệu từ database với xử lý lỗi
  let aboutData;
  try {
    aboutData = await getAboutData();
  } catch (error) {
    console.error("Error fetching about data:", error);
    // Trả về UI lỗi
    return (
      <div className="mb-16 p-6 rounded-lg bg-red-900/20 border border-red-800">
        <h2 className="text-xl font-bold text-red-500 mb-2">Không thể tải dữ liệu</h2>
        <p>Đã xảy ra lỗi khi tải thông tin về chúng tôi. Vui lòng thử lại sau.</p>
      </div>
    );
  }

  return (
    <div className="mb-16 grid grid-cols-1 gap-12 md:grid-cols-2">
      <div>
        <h1 className="mb-6 text-4xl font-bold uppercase">
          {aboutData?.title || "Hoàng Trí Moto"}
          <br />
          <span className="text-red-600">Đắk Lắk</span>
        </h1>
        <div
          className="mb-8 text-gray-300"
          dangerouslySetInnerHTML={{
            __html: aboutData?.content || `
              <p>Hoàng Trí Moto tự hào là đơn vị hàng đầu trong lĩnh vực sửa chữa, bảo dưỡng và độ xe mô tô tại Đắk Lắk. Với đội ngũ kỹ thuật viên giàu kinh nghiệm và trang thiết bị hiện đại, chúng tôi cam kết mang đến dịch vụ chất lượng cao nhất cho khách hàng.</p>
              <p>Thành lập từ năm 2010, Hoàng Trí Moto đã không ngừng phát triển và khẳng định vị thế trên thị trường. Chúng tôi tự hào về sự tin tưởng và ủng hộ của hàng nghìn khách hàng trong suốt thời gian qua.</p>
            `
          }}
        />
        <ul className="mb-8 space-y-3">
          <li className="flex items-center">
            <CheckCircle className="mr-3 h-5 w-5 text-red-600" />
            <span>Đội ngũ kỹ thuật viên được đào tạo chuyên nghiệp</span>
          </li>
          <li className="flex items-center">
            <CheckCircle className="mr-3 h-5 w-5 text-red-600" />
            <span>Trang thiết bị và công cụ hiện đại</span>
          </li>
          <li className="flex items-center">
            <CheckCircle className="mr-3 h-5 w-5 text-red-600" />
            <span>Phụ tùng chính hãng 100%</span>
          </li>
          <li className="flex items-center">
            <CheckCircle className="mr-3 h-5 w-5 text-red-600" />
            <span>Bảo hành dài hạn cho mọi dịch vụ</span>
          </li>
        </ul>
        <Button className="bg-red-600 px-8 py-6 text-lg font-semibold text-white hover:bg-red-700">
          <Link href="/lien-he">Liên Hệ Ngay</Link>
        </Button>
      </div>
      <div className="relative">
        <div className="absolute -right-4 -top-4 h-full w-full border-t-4 border-r-4 border-red-600"></div>
        <div className="relative h-full w-full overflow-hidden">
          <Image
            src={aboutData?.images?.[0]?.url || "/placeholder.svg?height=600&width=500"}
            alt={aboutData?.images?.[0]?.alt || "Hoàng Trí Moto"}
            width={500}
            height={600}
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </div>
  );
  
  const values = [
    {
      icon: <Users className="h-12 w-12 text-red-600" />,
      title: "Khách Hàng Là Trọng Tâm",
      description: "Chúng tôi luôn đặt nhu cầu và sự hài lòng của khách hàng lên hàng đầu trong mọi hoạt động.",
    },
    {
      icon: <Wrench className="h-12 w-12 text-red-600" />,
      title: "Chất Lượng Vượt Trội",
      description: "Cam kết mang đến dịch vụ sửa chữa và sản phẩm chất lượng cao nhất cho khách hàng.",
    },
    {
      icon: <Award className="h-12 w-12 text-red-600" />,
      title: "Chuyên Nghiệp & Uy Tín",
      description: "Đội ngũ nhân viên được đào tạo chuyên nghiệp, làm việc với tinh thần trách nhiệm cao.",
    },
    {
      icon: <Clock className="h-12 w-12 text-red-600" />,
      title: "Nhanh Chóng & Hiệu Quả",
      description: "Tối ưu hóa quy trình làm việc để đảm bảo thời gian sửa chữa nhanh chóng và hiệu quả.",
    },
  ];

  return (
    <div className="min-h-screen bg-black pt-24">
      <div className="container mx-auto px-4 py-16">
        {/* Breadcrumb */}
        <div className="mb-8 flex items-center text-sm text-gray-400">
          <Link href="/" className="hover:text-red-600">
            Trang Chủ
          </Link>
          <ChevronRight className="mx-2 h-4 w-4" />
          <span className="text-white">Về Chúng Tôi</span>
        </div>

        {/* Hero Section */}
        <div className="mb-16 grid grid-cols-1 gap-12 md:grid-cols-2">
          <div>
            <h1 className="mb-6 text-4xl font-bold uppercase">
              {aboutData?.title || "Hoàng Trí Moto"}
              <br />
              <span className="text-red-600">Đắk Lắk</span>
            </h1>
            <div 
              className="mb-8 text-gray-300"
              dangerouslySetInnerHTML={{ 
                __html: aboutData?.content || `                 
                `
              }}
            />
            <ul className="mb-8 space-y-3">
              <li className="flex items-center">
                <CheckCircle className="mr-3 h-5 w-5 text-red-600" />
                <span>Đội ngũ kỹ thuật viên được đào tạo chuyên nghiệp</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="mr-3 h-5 w-5 text-red-600" />
                <span>Trang thiết bị và công cụ hiện đại</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="mr-3 h-5 w-5 text-red-600" />
                <span>Phụ tùng chính hãng 100%</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="mr-3 h-5 w-5 text-red-600" />
                <span>Bảo hành dài hạn cho mọi dịch vụ</span>
              </li>
            </ul>
            <Button className="bg-red-600 px-8 py-6 text-lg font-semibold text-white hover:bg-red-700">
              <Link href="/lien-he">Liên Hệ Ngay</Link>
            </Button>
          </div>
          <div className="relative">
            <div className="absolute -right-4 -top-4 h-full w-full border-t-4 border-r-4 border-red-600"></div>
            <div className="relative h-full w-full overflow-hidden">
              <Image
                src={aboutData?.images?.[0]?.url || "/placeholder.svg?height=600&width=500"}
                alt={aboutData?.images?.[0]?.alt || "Hoàng Trí Moto"}
                width={500}
                height={600}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Our Values */}
        <div className="mb-16">
          <h2 className="mb-12 text-center text-3xl font-bold uppercase">Giá Trị Cốt Lõi</h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value, index) => (
              <div key={index} className="rounded-lg bg-zinc-900 p-6 text-center">
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-zinc-800">
                  {value.icon}
                </div>
                <h3 className="mb-3 text-xl font-bold">{value.title}</h3>
                <p className="text-gray-400">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Phần Đội Ngũ được tách thành component riêng */}
        <TeamMembers />

        {/* Phần Đánh Giá Khách Hàng */}
        <TestimonialsServer />
      </div>
    </div>
  )
} 