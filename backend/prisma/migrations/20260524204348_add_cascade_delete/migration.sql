-- DropForeignKey
ALTER TABLE "Deposit" DROP CONSTRAINT "Deposit_memberId_fkey";

-- DropForeignKey
ALTER TABLE "DueRecord" DROP CONSTRAINT "DueRecord_memberId_fkey";

-- DropForeignKey
ALTER TABLE "Withdrawal" DROP CONSTRAINT "Withdrawal_memberId_fkey";

-- AddForeignKey
ALTER TABLE "Deposit" ADD CONSTRAINT "Deposit_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Withdrawal" ADD CONSTRAINT "Withdrawal_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DueRecord" ADD CONSTRAINT "DueRecord_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;
