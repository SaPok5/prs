import { gql } from "@apollo/client";

export const GET_TOTAL_DEALS_USERS = gql`
  query Status($timeFrame: String) {
    displayTotalDealsOfUsers(timeFrame: $timeFrame) {
      status {
        message
        success
      }
      data {
        totalDeals
        totalValue
        userId
        userName
      }
    }
  }
`;

export const GET_TOTAL_AMOUNT_OF_EMPLOYEE_IN_MONTH = gql`
  query DisplayTotalAmountOfEmployeeInMonthWithWorkType(
    $teamId: String
    $startDate: String
    $endDate: String
  ) {
    displayTotalAmountOfEmployeeInMonthWithWorkType(
      teamId: $teamId
      startDate: $startDate
      endDate: $endDate
    ) {
      employees {
        employeeName
        workTypes {
          dueAmount
          receivedAmount
          totalAmount
          workTypeName
        }
      }
      overallTotals {
        dueAmount
        receivedAmount
        totalAmount
      }
      workTypeTotals {
        dueAmount
        receivedAmount
        totalAmount
        workTypeName
      }
    }
  }
`;

export const GET_EMPLOYEE_SALES_BY_TEAM = gql`
  query GetEmployeeSalesByTeam($input: EmployeeSalesInput!) {
    getEmployeeSalesByTeam(input: $input) {
      overallMetrics {
        averageDealValue
        topPerformers {
          employeeId
          employeeName
          teamName
          totalSales
        }
      }
      periodEnd
      periodLabel
      periodStart
      teamSales {
        teamId
        teamName
        totalDeals
        totalPaid
        totalSales
        totalDues
        employees {
          employeeId
          employeeName
          totalDeals
          totalPaid
          totalSales
          totalDues
          workTypeSales {
            name
            totalDeals
            totalSales
          }
        }
      }
    }
  }
`;
