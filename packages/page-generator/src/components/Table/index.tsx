import React from 'react';
import { Table } from 'antd'

interface TableProps {

}

const ChocTable = (props: TableProps) => {
  return (
    <Table {...props} />
  )
}

export default ChocTable
