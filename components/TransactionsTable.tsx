// import {
//   Table,
//   TableBody,
//   TableCaption,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table"
// import { transactionCategoryStyles } from "@/constants"
// import { cn, formatAmount, formatDateTime, getTransactionStatus, removeSpecialCharacters } from "@/lib/utils"

// const CategoryBadge = ({ category }: CategoryBadgeProps) => {
//   const {
//     borderColor,
//     backgroundColor,
//     textColor,
//     chipBackgroundColor,
//    } = transactionCategoryStyles[category as keyof typeof transactionCategoryStyles] || transactionCategoryStyles.default
   
//   return (
//     <div className={cn('category-badge', borderColor, chipBackgroundColor)}>
//       <div className={cn('size-2 rounded-full', backgroundColor)} />
//       <p className={cn('text-[12px] font-medium', textColor)}>{category}</p>
//     </div>
//   )
// } 

// const TransactionsTable = ({ transactions }: TransactionTableProps) => {
//   return (
//     <Table>
//       <TableHeader className="bg-[#f9fafb]">
//         <TableRow>
//           <TableHead className="px-2">Transaction</TableHead>
//           <TableHead className="px-2">Amount</TableHead>
//           <TableHead className="px-2">Status</TableHead>
//           <TableHead className="px-2">Date</TableHead>
//           <TableHead className="px-2 max-md:hidden">Channel</TableHead>
//           <TableHead className="px-2 max-md:hidden">Category</TableHead>
//         </TableRow>
//       </TableHeader>
//       <TableBody>
//         {transactions.map((t: Transaction) => {
//           const status = getTransactionStatus(new Date(t.date))
//           const amount = formatAmount(t.amount)

//           const isDebit = t.type === 'debit';
//           const isCredit = t.type === 'credit';

//           return (
//             <TableRow key={t.id} className={`${isDebit || amount[0] === '-' ? 'bg-[#FFFBFA]' : 'bg-[#F6FEF9]'} !over:bg-none !border-b-DEFAULT`}>
//               <TableCell className="max-w-[250px] pl-2 pr-10">
//                 <div className="flex items-center gap-3">
//                   <h1 className="text-14 truncate font-semibold text-[#344054]">
//                     {removeSpecialCharacters(t.name)}
//                   </h1>
//                 </div>
//               </TableCell>

//               <TableCell className={`pl-2 pr-10 font-semibold ${
//                 isDebit || amount[0] === '-' ?
//                   'text-[#f04438]'
//                   : 'text-[#039855]'
//               }`}>
//                 {isDebit ? `-${amount}` : isCredit ? amount : amount}
//               </TableCell>

//               <TableCell className="pl-2 pr-10">
//                 <CategoryBadge category={status} /> 
//               </TableCell>

//               <TableCell className="min-w-32 pl-2 pr-10">
//                 {formatDateTime(new Date(t.date)).dateTime}
//               </TableCell>

//               <TableCell className="pl-2 pr-10 capitalize min-w-24">
//                {t.paymentChannel}
//               </TableCell>

//               <TableCell className="pl-2 pr-10 max-md:hidden">
//                <CategoryBadge category={t.category} /> 
//               </TableCell>
//             </TableRow>
//           )
//         })}
//       </TableBody>
//     </Table>
//   )
// }

// export default TransactionsTable

"use client" // This makes the component a Client Component

import { jsPDF } from "jspdf"
import "jspdf-autotable"  // Import autoTable plugin
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { transactionCategoryStyles } from "@/constants"
import { cn, formatAmount, formatDateTime, getTransactionStatus, removeSpecialCharacters } from "@/lib/utils"

const CategoryBadge = ({ category }: CategoryBadgeProps) => {
  const {
    borderColor,
    backgroundColor,
    textColor,
    chipBackgroundColor,
  } = transactionCategoryStyles[category as keyof typeof transactionCategoryStyles] || transactionCategoryStyles.default

  return (
    <div className={cn('category-badge', borderColor, chipBackgroundColor)}>
      <div className={cn('size-2 rounded-full', backgroundColor)} />
      <p className={cn('text-[12px] font-medium', textColor)}>{category}</p>
    </div>
  )
}

const TransactionsTable = ({ transactions }: TransactionTableProps) => {
  const generatePDF = () => {
    const doc = new jsPDF()

    // Add Title
    doc.setFontSize(16)
    doc.text("Transactions List", 14, 10)

    // Define column widths
    const columnWidths = [50, 40, 40, 40, 50];

    // Set table headers using autoTable
    const headers = ["Transaction", "Amount", "Status", "Date", "Channel"]
    const rows = transactions.map((transaction) => {
      const status = getTransactionStatus(new Date(transaction.date))
      const amount = formatAmount(transaction.amount)
      const isDebit = transaction.type === "debit"
      const isCredit = transaction.type === "credit"

      return [
        removeSpecialCharacters(transaction.name),
        isDebit ? `-${amount}` : isCredit ? amount : amount,
        status,
        formatDateTime(new Date(transaction.date)).dateTime,
        transaction.paymentChannel,
      ]
    })

    // Use autoTable to create the table
    doc.autoTable({
      startY: 20,  // Starting position for the table
      head: [headers],
      body: rows,
      columnStyles: {
        0: { cellWidth: columnWidths[0] },  // Set the width of the first column
        1: { cellWidth: columnWidths[1] },  // Set the width of the second column
        2: { cellWidth: columnWidths[2] },  // Set the width of the third column
        3: { cellWidth: columnWidths[3] },  // Set the width of the fourth column
        // 4: { cellWidth: columnWidths[3] },  // Set the width of the fifth column
        // 5: { cellWidth: columnWidths[3] },
      },
      margin: { top: 20, left: 2, right: 2 }, // Set custom margins
      pageBreak: "auto", // Automatically break pages when the content exceeds the page height
      theme: 'grid',
    })

    // Save the PDF with a generic name
    doc.save("transactions-list.pdf")
  }

  return (
    <div className="relative">
      <div 
        onClick={generatePDF} 
        className="absolute -top-10 right-0 left-2 bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-lg cursor-pointer text-sm font-semibold shadow-sm"
      >
        Export PDF
      </div>
      <Table>
        <TableHeader className="bg-[#f9fafb]">
          <TableRow>
            <TableHead className="px-2">Transaction</TableHead>
            <TableHead className="px-2">Amount</TableHead>
            <TableHead className="px-2">Status</TableHead>
            <TableHead className="px-2">Date</TableHead>
            <TableHead className="px-2 max-md:hidden">Channel</TableHead>
            <TableHead className="px-2 max-md:hidden">Category</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((t: Transaction) => {
            const status = getTransactionStatus(new Date(t.date))
            const amount = formatAmount(t.amount)

            const isDebit = t.type === "debit"
            const isCredit = t.type === "credit"

            return (
              <TableRow
                key={t.id}
                className={`${
                  isDebit || amount[0] === "-" ? "bg-[#FFFBFA]" : "bg-[#F6FEF9]"
                } !over:bg-none !border-b-DEFAULT`}
              >
                <TableCell className="max-w-[250px] pl-2 pr-10">
                  <div className="flex items-center gap-3">
                    <h1 className="text-14 truncate font-semibold text-[#344054]">
                      {removeSpecialCharacters(t.name)}
                    </h1>
                  </div>
                </TableCell>

                <TableCell
                  className={`pl-2 pr-10 font-semibold ${
                    isDebit || amount[0] === "-" ? "text-[#f04438]" : "text-[#039855]"
                  }`}
                >
                  {isDebit ? `-${amount}` : isCredit ? amount : amount}
                </TableCell>

                <TableCell className="pl-2 pr-10">
                  <CategoryBadge category={status} />
                </TableCell>

                <TableCell className="min-w-32 pl-2 pr-10">
                  {formatDateTime(new Date(t.date)).dateTime}
                </TableCell>

                <TableCell className="pl-2 pr-10 capitalize min-w-24">
                  {t.paymentChannel}
                </TableCell>

                <TableCell className="pl-2 pr-10 max-md:hidden">
                  <CategoryBadge category={t.category} />
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}

export default TransactionsTable
