-- CreateTable
CREATE TABLE "Meetup" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "lng" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Meetup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MeetupTag" (
    "meetupId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,

    CONSTRAINT "MeetupTag_pkey" PRIMARY KEY ("meetupId","tagId")
);

-- CreateTable
CREATE TABLE "_MeetupTags" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_MeetupTags_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_key" ON "Tag"("name");

-- CreateIndex
CREATE INDEX "_MeetupTags_B_index" ON "_MeetupTags"("B");

-- AddForeignKey
ALTER TABLE "MeetupTag" ADD CONSTRAINT "MeetupTag_meetupId_fkey" FOREIGN KEY ("meetupId") REFERENCES "Meetup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MeetupTag" ADD CONSTRAINT "MeetupTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MeetupTags" ADD CONSTRAINT "_MeetupTags_A_fkey" FOREIGN KEY ("A") REFERENCES "Meetup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MeetupTags" ADD CONSTRAINT "_MeetupTags_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
