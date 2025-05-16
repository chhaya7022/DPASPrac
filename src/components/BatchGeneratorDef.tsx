import React, { useEffect, useState } from 'react';
import Header from './Header';
import Banner from './Banner';
import axios from 'axios';
import API_CONFIG from '../api/config';
import DataGrid from './DataGrid';
import { useNavigate } from 'react-router-dom';

interface BatchGeneratorDefItem {
  batchGenerationId: string;
  batchCode: string;
  date: string;
  remark: string;
  tableName: string;
  totalRecords: number;
  projectId: string;
  tableDefId: string;
}

const columns = [
  { header: 'Work Order No', accessor: 'WorkOrderNo' as const, sortable: true, filterable: true },
  { header: 'Batch Generation Date', accessor: 'BatchGenerationDate' as const, sortable: true, filterable: true },
  { header: 'Batch Code', accessor: 'BatchCode' as const, sortable: true, filterable: true },
  { header: 'Batch Remark', accessor: 'BatchRemark' as const, sortable: true, filterable: true },
  { header: 'Doc Type Name', accessor: 'DocTypeName' as const, sortable: true, filterable: true },
  { header: 'Org Level Combine Code', accessor: 'OrgLevelCombineCode' as const, sortable: true, filterable: true },
  { header: 'Batch Qty', accessor: 'BatchQty' as const, sortable: true, filterable: true },
  { header: 'Print Count', accessor: 'PrintCount' as const, sortable: true, filterable: true },
];

const BatchGeneratorDef: React.FC = () => {
  const [getListData, setListData] = useState<any[]>([]);
  const [getListDataView, setListDataView] = useState<BatchGeneratorDefItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;
  const navigate = useNavigate();

  useEffect(() => {
    const curdInput = {
      inputJson: JSON.stringify({
        ProjectId: 2,
        ProcessStatusKey: 'GEN',
        localeCode: 'en',
      }),
      primaryKeyId: 0,
      tableName: 'BatchGeneration',
      indexPage: '0',
      operationType: 'SEL',
      initiatedByUserOid: 'a0759f78-0c86-488e-ab8c-7e54d4c098a6',
      ApiToCall: 'CRUD',
    };

    const fetchData = async () => {
      try {
        const response = await axios.post(
          `${API_CONFIG.BaseUrl}${API_CONFIG.BaseUrlWrapper}`,
          curdInput
        );
        console.log('Response Data:', response.data);
        setListData(response.data);
        setListDataView(response.data);
      } catch (err) {
        console.error('Failed to fetch data', err);
      }
    };

    fetchData();
  }, []);

  const totalPages = Math.ceil(getListData.length / pageSize);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const onViewClick = (rowData: BatchGeneratorDefItem) => {
    navigate('/batchGenerationView', { state: { data: rowData } });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />
      <main className="container mx-auto px-4 pt-20 pb-2 flex-1 overflow-auto">
        <Banner title="Batch Generation" className="mt-1" />
        <DataGrid
          columns={columns}
          data={getListData}
          currentPage={currentPage}
          pageSize={pageSize}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          controls={{ view: true, print: true, qr: true, bar: true }}
          onView={onViewClick}
        />
      </main>
    </div>
  );
};

export default BatchGeneratorDef;
