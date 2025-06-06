-- CreateTable
CREATE TABLE "jamaah" (
    "jamaah_code" VARCHAR(25) NOT NULL,
    "first_name" VARCHAR(25) NOT NULL,
    "mid_name" VARCHAR(25),
    "last_name" VARCHAR(25),
    "identity_number" VARCHAR(10) NOT NULL,
    "birth_place" VARCHAR(10) NOT NULL,
    "birth_date" TIMESTAMP(3) NOT NULL,
    "gender" INTEGER NOT NULL,
    "married_status" INTEGER NOT NULL,
    "father_name" VARCHAR(25) NOT NULL,
    "mother_name" VARCHAR(25) NOT NULL,
    "phone_number" VARCHAR(25) NOT NULL,
    "province" INTEGER NOT NULL,
    "district" INTEGER NOT NULL,
    "sub_district" INTEGER NOT NULL,
    "neighborhoods" INTEGER NOT NULL,
    "address" VARCHAR(100) NOT NULL,
    "home_phone_number" VARCHAR(25),
    "medical_condition" TEXT,
    "self_photo" VARCHAR(50),
    "photo_identity" VARCHAR(50),
    "notes" TEXT,
    "status" CHAR(1) NOT NULL,
    "agents_id" UUID,
    "staff_id" UUID,
    "created_by" TEXT DEFAULT 'system',
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_by" TEXT DEFAULT 'system',
    "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "jamaah_pkey" PRIMARY KEY ("jamaah_code")
);

-- CreateTable
CREATE TABLE "documents" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(15) NOT NULL,
    "status" CHAR(1) NOT NULL,
    "created_by" TEXT DEFAULT 'system',
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_by" TEXT DEFAULT 'system',
    "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jamaah_documents" (
    "id" SERIAL NOT NULL,
    "jamaah_id" VARCHAR(25) NOT NULL,
    "document_id" INTEGER NOT NULL,
    "status" CHAR(1) NOT NULL,
    "created_by" TEXT DEFAULT 'system',
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_by" TEXT DEFAULT 'system',
    "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "jamaah_documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "citys" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "status" CHAR(1) NOT NULL,
    "created_by" TEXT DEFAULT 'system',
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_by" TEXT DEFAULT 'system',
    "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "citys_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hotels" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(25) NOT NULL,
    "stars" VARCHAR(5),
    "photo" VARCHAR(100),
    "city_id" INTEGER NOT NULL,
    "status" CHAR(1) NOT NULL,
    "created_by" TEXT DEFAULT 'system',
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_by" TEXT DEFAULT 'system',
    "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "hotels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "airlines" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "display_name" VARCHAR(40) NOT NULL,
    "status" CHAR(1) NOT NULL,
    "created_by" TEXT DEFAULT 'system',
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_by" TEXT DEFAULT 'system',
    "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "airlines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transportations" (
    "id" SERIAL NOT NULL,
    "company_name" VARCHAR(50) NOT NULL,
    "type" CHAR(1) NOT NULL,
    "status" CHAR(1) NOT NULL,
    "created_by" TEXT DEFAULT 'system',
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_by" TEXT DEFAULT 'system',
    "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "transportations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "partners" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "ppiu_number" VARCHAR(50) NOT NULL,
    "phone_pic" VARCHAR(50) NOT NULL,
    "phone_presdir" VARCHAR(50) NOT NULL,
    "phone_office" VARCHAR(50) NOT NULL,
    "pic_name" VARCHAR(50) NOT NULL,
    "email" VARCHAR(50) NOT NULL,
    "address" VARCHAR(100) NOT NULL,
    "product_type" INTEGER NOT NULL,
    "categories" CHAR(1) NOT NULL,
    "status" CHAR(1) NOT NULL,
    "created_by" TEXT DEFAULT 'system',
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_by" TEXT DEFAULT 'system',
    "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "partners_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_types" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(20) NOT NULL,
    "description" VARCHAR(20) NOT NULL,
    "status" CHAR(1) NOT NULL,
    "created_by" TEXT DEFAULT 'system',
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_by" TEXT DEFAULT 'system',
    "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "provinces" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(20) NOT NULL,
    "status" CHAR(1) NOT NULL,
    "created_by" TEXT DEFAULT 'system',
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_by" TEXT DEFAULT 'system',
    "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "provinces_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "districts" (
    "id" SERIAL NOT NULL,
    "province_id" INTEGER NOT NULL,
    "name" VARCHAR(20) NOT NULL,
    "status" CHAR(1) NOT NULL,
    "created_by" TEXT DEFAULT 'system',
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_by" TEXT DEFAULT 'system',
    "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "districts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sub_districts" (
    "id" SERIAL NOT NULL,
    "province_id" INTEGER NOT NULL,
    "district_id" INTEGER NOT NULL,
    "name" VARCHAR(20) NOT NULL,
    "status" CHAR(1) NOT NULL,
    "created_by" TEXT DEFAULT 'system',
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_by" TEXT DEFAULT 'system',
    "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sub_districts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "neighborhoods" (
    "id" SERIAL NOT NULL,
    "province_id" INTEGER NOT NULL,
    "district_id" INTEGER NOT NULL,
    "sub_district_id" INTEGER NOT NULL,
    "name" VARCHAR(20) NOT NULL,
    "status" CHAR(1) NOT NULL,
    "created_by" TEXT DEFAULT 'system',
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_by" TEXT DEFAULT 'system',
    "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "neighborhoods_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tickets" (
    "id" SERIAL NOT NULL,
    "booking_code" VARCHAR(10) NOT NULL,
    "partner_id" INTEGER NOT NULL,
    "day_pack" INTEGER NOT NULL,
    "seat_pack" INTEGER NOT NULL,
    "materialisasi" INTEGER NOT NULL,
    "cancel" INTEGER NOT NULL,
    "transaction_date" TIMESTAMP(3) NOT NULL,
    "status" CHAR(1) NOT NULL,
    "created_by" TEXT DEFAULT 'system',
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_by" TEXT DEFAULT 'system',
    "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tickets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ticket_details" (
    "id" SERIAL NOT NULL,
    "ticket_id" INTEGER NOT NULL,
    "type" INTEGER NOT NULL,
    "ticket_date" TIMESTAMP(3) NOT NULL,
    "ticket_airline" INTEGER NOT NULL,
    "flight_no" TEXT,
    "ticket_from" VARCHAR(5) NOT NULL,
    "ticket_etd" INTEGER NOT NULL,
    "ticket_to" VARCHAR(5) NOT NULL,
    "ticket_eta" INTEGER NOT NULL,
    "created_by" TEXT DEFAULT 'system',
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_by" TEXT DEFAULT 'system',
    "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ticket_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "airport" (
    "code" VARCHAR(5) NOT NULL,
    "name" VARCHAR(25) NOT NULL,
    "status" CHAR(1) NOT NULL,
    "created_by" TEXT DEFAULT 'system',
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_by" TEXT DEFAULT 'system',
    "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "airport_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "ticket_transaction" (
    "id" SERIAL NOT NULL,
    "booking_code" VARCHAR(10) NOT NULL,
    "partner_id" INTEGER NOT NULL,
    "trx_number" TEXT NOT NULL,
    "created_by" TEXT DEFAULT 'system',
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_by" TEXT DEFAULT 'system',
    "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ticket_transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "packages" (
    "id" VARCHAR(20) NOT NULL,
    "name" VARCHAR(20) NOT NULL,
    "itinerary" VARCHAR(50),
    "manasik_invitation" VARCHAR(50),
    "brochure" VARCHAR(50),
    "departure_info" VARCHAR(50),
    "ticket" INTEGER,
    "maturity_passport_delivery" TIMESTAMP(3),
    "maturity_repayment" TIMESTAMP(3),
    "manasik_date" TIMESTAMP(3),
    "manasik_time" TIMESTAMP(3),
    "manasik_price" INTEGER,
    "admin_price" INTEGER,
    "equipment_handling_price" INTEGER,
    "pcr_price" INTEGER,
    "airport_rally_point" VARCHAR(50),
    "gathering_time" TIMESTAMP(3),
    "tour_lead" VARCHAR(25),
    "checkin_madinah" TIMESTAMP(3),
    "checkout_madinah" TIMESTAMP(3),
    "checkin_mekkah" TIMESTAMP(3),
    "checkout_mekkah" TIMESTAMP(3),
    "isPromo" BOOLEAN NOT NULL DEFAULT false,
    "wa_group" VARCHAR(10),
    "notes" TEXT,
    "status" CHAR(1) NOT NULL,
    "created_by" TEXT DEFAULT 'system',
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_by" TEXT DEFAULT 'system',
    "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "packages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "package_types" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(20) NOT NULL,
    "desc" VARCHAR(20) NOT NULL,
    "created_by" TEXT DEFAULT 'system',
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_by" TEXT DEFAULT 'system',
    "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "package_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "room_types" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(20) NOT NULL,
    "desc" VARCHAR(20) NOT NULL,
    "created_by" TEXT DEFAULT 'system',
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_by" TEXT DEFAULT 'system',
    "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "room_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "package_hotels" (
    "id" SERIAL NOT NULL,
    "package_id" TEXT NOT NULL,
    "package_type_id" INTEGER NOT NULL,
    "city_id" INTEGER NOT NULL,
    "hotel_id" INTEGER NOT NULL,
    "created_by" TEXT DEFAULT 'system',
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_by" TEXT DEFAULT 'system',
    "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "package_hotels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "package_rooms" (
    "id" SERIAL NOT NULL,
    "package_type_id" INTEGER NOT NULL,
    "room_type_id" INTEGER NOT NULL,
    "status" CHAR(1) NOT NULL,
    "created_by" TEXT DEFAULT 'system',
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_by" TEXT DEFAULT 'system',
    "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "package_rooms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "package_room_prices" (
    "id" SERIAL NOT NULL,
    "packages_id" TEXT NOT NULL,
    "package_rooms_id" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,
    "created_by" TEXT DEFAULT 'system',
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_by" TEXT DEFAULT 'system',
    "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "package_room_prices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "umrah_registers" (
    "id" TEXT NOT NULL,
    "umroh_code" VARCHAR(20) NOT NULL,
    "jamaah" VARCHAR(25) NOT NULL,
    "remarks" INTEGER NOT NULL,
    "mahram" VARCHAR(20),
    "package" TEXT NOT NULL,
    "package_room_price" INTEGER NOT NULL,
    "office_discount" INTEGER NOT NULL,
    "agent_discount" INTEGER NOT NULL,
    "agent_id" INTEGER,
    "register_name" VARCHAR(20) NOT NULL,
    "register_phone" VARCHAR(20) NOT NULL,
    "notes" VARCHAR(100),
    "pin" INTEGER NOT NULL,
    "status" CHAR(1) NOT NULL,
    "created_by" TEXT DEFAULT 'system',
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_by" TEXT DEFAULT 'system',
    "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "umrah_registers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "umrah_payments" (
    "id" TEXT NOT NULL,
    "jamaah" VARCHAR(25) NOT NULL,
    "umrah_register_code" VARCHAR(20) NOT NULL,
    "remaining_package_payment" INTEGER NOT NULL,
    "remaining_equipment_payment" INTEGER NOT NULL,
    "remaining_pcr_payment" INTEGER NOT NULL,
    "remaining_other_payment" INTEGER NOT NULL,
    "status" CHAR(1) NOT NULL,
    "trx_number" TEXT,
    "created_by" TEXT DEFAULT 'system',
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_by" TEXT DEFAULT 'system',
    "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "umrah_payments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tickets_booking_code_key" ON "tickets"("booking_code");

-- CreateIndex
CREATE UNIQUE INDEX "umrah_registers_umroh_code_key" ON "umrah_registers"("umroh_code");

-- AddForeignKey
ALTER TABLE "jamaah" ADD CONSTRAINT "jamaah_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jamaah" ADD CONSTRAINT "jamaah_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jamaah_documents" ADD CONSTRAINT "jamaah_documents_jamaah_id_fkey" FOREIGN KEY ("jamaah_id") REFERENCES "jamaah"("jamaah_code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jamaah_documents" ADD CONSTRAINT "jamaah_documents_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "documents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jamaah_documents" ADD CONSTRAINT "jamaah_documents_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jamaah_documents" ADD CONSTRAINT "jamaah_documents_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "citys" ADD CONSTRAINT "citys_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "citys" ADD CONSTRAINT "citys_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hotels" ADD CONSTRAINT "hotels_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "citys"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hotels" ADD CONSTRAINT "hotels_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hotels" ADD CONSTRAINT "hotels_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "airlines" ADD CONSTRAINT "airlines_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "airlines" ADD CONSTRAINT "airlines_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transportations" ADD CONSTRAINT "transportations_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transportations" ADD CONSTRAINT "transportations_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "partners" ADD CONSTRAINT "partners_product_type_fkey" FOREIGN KEY ("product_type") REFERENCES "product_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "partners" ADD CONSTRAINT "partners_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "partners" ADD CONSTRAINT "partners_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_types" ADD CONSTRAINT "product_types_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_types" ADD CONSTRAINT "product_types_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "provinces" ADD CONSTRAINT "provinces_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "provinces" ADD CONSTRAINT "provinces_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "districts" ADD CONSTRAINT "districts_province_id_fkey" FOREIGN KEY ("province_id") REFERENCES "provinces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "districts" ADD CONSTRAINT "districts_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "districts" ADD CONSTRAINT "districts_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sub_districts" ADD CONSTRAINT "sub_districts_province_id_fkey" FOREIGN KEY ("province_id") REFERENCES "provinces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sub_districts" ADD CONSTRAINT "sub_districts_district_id_fkey" FOREIGN KEY ("district_id") REFERENCES "districts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sub_districts" ADD CONSTRAINT "sub_districts_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sub_districts" ADD CONSTRAINT "sub_districts_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "neighborhoods" ADD CONSTRAINT "neighborhoods_province_id_fkey" FOREIGN KEY ("province_id") REFERENCES "provinces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "neighborhoods" ADD CONSTRAINT "neighborhoods_district_id_fkey" FOREIGN KEY ("district_id") REFERENCES "districts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "neighborhoods" ADD CONSTRAINT "neighborhoods_sub_district_id_fkey" FOREIGN KEY ("sub_district_id") REFERENCES "sub_districts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "neighborhoods" ADD CONSTRAINT "neighborhoods_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "neighborhoods" ADD CONSTRAINT "neighborhoods_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_partner_id_fkey" FOREIGN KEY ("partner_id") REFERENCES "partners"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ticket_details" ADD CONSTRAINT "ticket_details_ticket_id_fkey" FOREIGN KEY ("ticket_id") REFERENCES "tickets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ticket_details" ADD CONSTRAINT "ticket_details_ticket_airline_fkey" FOREIGN KEY ("ticket_airline") REFERENCES "airlines"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ticket_details" ADD CONSTRAINT "ticket_details_ticket_from_fkey" FOREIGN KEY ("ticket_from") REFERENCES "airport"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ticket_details" ADD CONSTRAINT "ticket_details_ticket_to_fkey" FOREIGN KEY ("ticket_to") REFERENCES "airport"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ticket_details" ADD CONSTRAINT "ticket_details_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ticket_details" ADD CONSTRAINT "ticket_details_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "airport" ADD CONSTRAINT "airport_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "airport" ADD CONSTRAINT "airport_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ticket_transaction" ADD CONSTRAINT "ticket_transaction_booking_code_fkey" FOREIGN KEY ("booking_code") REFERENCES "tickets"("booking_code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ticket_transaction" ADD CONSTRAINT "ticket_transaction_partner_id_fkey" FOREIGN KEY ("partner_id") REFERENCES "partners"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ticket_transaction" ADD CONSTRAINT "ticket_transaction_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ticket_transaction" ADD CONSTRAINT "ticket_transaction_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "packages" ADD CONSTRAINT "packages_ticket_fkey" FOREIGN KEY ("ticket") REFERENCES "tickets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "packages" ADD CONSTRAINT "packages_tour_lead_fkey" FOREIGN KEY ("tour_lead") REFERENCES "jamaah"("jamaah_code") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "packages" ADD CONSTRAINT "packages_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "packages" ADD CONSTRAINT "packages_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "package_types" ADD CONSTRAINT "package_types_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "package_types" ADD CONSTRAINT "package_types_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "room_types" ADD CONSTRAINT "room_types_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "room_types" ADD CONSTRAINT "room_types_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "package_hotels" ADD CONSTRAINT "package_hotels_package_id_fkey" FOREIGN KEY ("package_id") REFERENCES "packages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "package_hotels" ADD CONSTRAINT "package_hotels_package_type_id_fkey" FOREIGN KEY ("package_type_id") REFERENCES "package_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "package_hotels" ADD CONSTRAINT "package_hotels_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "citys"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "package_hotels" ADD CONSTRAINT "package_hotels_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "package_hotels" ADD CONSTRAINT "package_hotels_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "package_hotels" ADD CONSTRAINT "package_hotels_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "package_rooms" ADD CONSTRAINT "package_rooms_package_type_id_fkey" FOREIGN KEY ("package_type_id") REFERENCES "package_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "package_rooms" ADD CONSTRAINT "package_rooms_room_type_id_fkey" FOREIGN KEY ("room_type_id") REFERENCES "room_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "package_rooms" ADD CONSTRAINT "package_rooms_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "package_rooms" ADD CONSTRAINT "package_rooms_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "package_room_prices" ADD CONSTRAINT "package_room_prices_packages_id_fkey" FOREIGN KEY ("packages_id") REFERENCES "packages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "package_room_prices" ADD CONSTRAINT "package_room_prices_package_rooms_id_fkey" FOREIGN KEY ("package_rooms_id") REFERENCES "package_rooms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "package_room_prices" ADD CONSTRAINT "package_room_prices_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "package_room_prices" ADD CONSTRAINT "package_room_prices_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "umrah_registers" ADD CONSTRAINT "umrah_registers_jamaah_fkey" FOREIGN KEY ("jamaah") REFERENCES "jamaah"("jamaah_code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "umrah_registers" ADD CONSTRAINT "umrah_registers_package_fkey" FOREIGN KEY ("package") REFERENCES "packages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "umrah_registers" ADD CONSTRAINT "umrah_registers_package_room_price_fkey" FOREIGN KEY ("package_room_price") REFERENCES "package_room_prices"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "umrah_registers" ADD CONSTRAINT "umrah_registers_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "umrah_registers" ADD CONSTRAINT "umrah_registers_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "umrah_payments" ADD CONSTRAINT "umrah_payments_jamaah_fkey" FOREIGN KEY ("jamaah") REFERENCES "jamaah"("jamaah_code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "umrah_payments" ADD CONSTRAINT "umrah_payments_umrah_register_code_fkey" FOREIGN KEY ("umrah_register_code") REFERENCES "umrah_registers"("umroh_code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "umrah_payments" ADD CONSTRAINT "umrah_payments_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "umrah_payments" ADD CONSTRAINT "umrah_payments_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
