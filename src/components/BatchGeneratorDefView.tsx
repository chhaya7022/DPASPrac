
import React, { useEffect, useState } from 'react';
import Header from './Header';
import Banner from './Banner';
import axios from 'axios';
import API_CONFIG from '../api/config';
import DataGrid from './DataGrid';
import { useNavigate } from 'react-router-dom';
import { Label } from './ui/label';
import { Input } from './ui/input';
import FormSelect from './FormSelect';
import DateTimePicker from './DateTimePicker';
import { Button } from './ui/button';

interface BatchGeneratorDefViewItem {
  WorkOrderNo: string;
  BatchGenerationDate: string;
  batchGenerationId: string;
  BatchCode: string;
  BatchRemark: string;
  DocTypeName: string;
  OrgLevelCombineCode: string;
  BatchQty: number;
  PrintCount: number;
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

const BatchGeneratorDefView: React.FC = () => {
  const [getListData, setListData] = useState<BatchGeneratorDefViewItem[]>([]);
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
      tableName: 'BatchFileGeneration',
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

  // Form state variables
  const [batchDate, setBatchDate] = useState<string>("08-Jan-2025 00:00:00");
  const [workOrder, setWorkOrder] = useState<string>("AEDC/EDP/Dataligi-Kamrup(M)/131/2570(A)");
  const [batchQty, setBatchQty] = useState<string>("10");
  const [batchCode, setBatchCode] = useState<string>("01-001");
  const [batchRemark, setBatchRemark] = useState<string>("01-Name-----001");
  const [printCount, setPrintCount] = useState<string>("");
  
  // Define options for selects
  const workOrderOptions = [
    { value: "AEDC/EDP/Dataligi-Kamrup(M)/131/2570(A)", label: "AEDC/EDP/Dataligi-Kamrup(M)/131/2570(A)" }
  ];
  
  const fileGroupOptions = [
    { value: "group1", label: "Group 1" },
    { value: "group2", label: "Group 2" }
  ];
  
  const documentTypeOptions = [
    { value: "type1", label: "Type 1" },
    { value: "type2", label: "Type 2" }
  ];

  const onButtonClick=()=>{

  }
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />
      <main className="container mx-auto px-4 pt-20 pb-2 flex-1 overflow-auto">
        <Banner title="Batch Generation" className="mt-1" />

<div className="mt-2 mb-2">
  <div className="flex items-center justify-between gap-4">
    <div className="flex items-center gap-2">
      <span className="text-lg font-bold">Batch Generation</span>              
    </div>
    <div className="flex flex-wrap gap-2">
      <Button 
        onClick={onButtonClick} 
        className="bg-blue-500 text-white font-normal hover:bg-blue-600 h-9"
      >
        PRINT FORM FOR BATCH
      </Button>
      <Button 
        onClick={onButtonClick} 
        className="bg-blue-500 text-white font-normal hover:bg-blue-600 h-9"
      >
        PRINT BAR CODE FOR BATCH
      </Button>
      <Button 
        onClick={onButtonClick} 
        className="bg-blue-500 text-white font-normal hover:bg-blue-600 h-9"
      >
        PRINT QR CODE LABEL FOR BATCH
      </Button>
    </div>
  </div>
</div>


        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {/* Work Order Select */}
          <FormSelect
            label="Work Order"
            options={workOrderOptions}
            defaultValue={workOrder}
            onChange={setWorkOrder}
            placeholder="Select Work Order"
          />

          {/* File Group Select */}
          <FormSelect
            label="File Group"
            options={fileGroupOptions}
            placeholder="Select File Group"
          />
             <DateTimePicker
            label="Batch Generation Date"
            value={batchDate}
            onChange={setBatchDate}
          />

          {/* Batch Quantity Input */}
          <div className="space-y-2">
            <fieldset className="border border-gray-400 hover:border-gray-800 rounded-md p-1.5 group bg-white">
              <legend className="text-sm font-medium text-gray-700 px-1">Batch Quantity</legend>
              <Input 
                id="batchQty" 
                type="text" 
                value={batchQty} 
                style={{ all: 'unset', display: 'block', width: '100%', fontSize: '0.875rem' }}
                onChange={(e) => setBatchQty(e.target.value)}
              />
            </fieldset>
          </div>

          {/* Batch Code Input */}
          <div className="space-y-2">
            <fieldset className="border border-gray-400 hover:border-gray-800 rounded-md p-1.5 group bg-white">
              <legend className="text-sm font-medium text-gray-700 px-1">Batch Code</legend>       
              <Input 
                id="batchCode" 
                type="text" 
                value={batchCode} 
                style={{ all: 'unset', display: 'block', width: '100%', fontSize: '0.875rem' }}
                onChange={(e) => setBatchCode(e.target.value)}
              />
            </fieldset>
          </div>

          {/* Print Count Input */}
          <div className="space-y-2">
            <fieldset className="border border-gray-400 hover:border-gray-800 rounded-md p-1.5 group bg-white">
              <legend className="text-sm font-medium text-gray-700 px-1">Print Count</legend> 
              <Input 
                id="printCount" 
                type="text" 
                value={printCount} 
                onChange={(e) => setPrintCount(e.target.value)}
                style={{ all: 'unset', display: 'block', width: '100%', fontSize: '0.875rem' }}
              />
            </fieldset>
          </div>

          {/* Batch Remark Input */}
          <div className="space-y-2">
            <fieldset className="border border-gray-400 hover:border-gray-800 rounded-md p-1.5 group bg-white">
              <legend className="text-sm font-medium text-gray-700 px-1">Batch Remark</legend>
              <Input 
                id="batchRemark" 
                type="text" 
                value={batchRemark} 
                style={{ all: 'unset', display: 'block', width: '100%', fontSize: '0.875rem' }}
                onChange={(e) => setBatchRemark(e.target.value)}
              />
            </fieldset>
          </div>

          {/* Document Type Select */}
          <FormSelect
            label="Document Type"
            options={documentTypeOptions}
            placeholder="Select Document Type"
          />
        </div>

         <fieldset className="border border-gray-400 p-4 rounded-sm mt-5">
          <legend className="text-base text-lg font-semibold text-gray-800 px-1">Batch Files</legend>
        <DataGrid
          columns={columns}
          data={getListData}
          currentPage={currentPage}
          pageSize={pageSize}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
        </fieldset>
      </main>
    </div>
  );
};

export default BatchGeneratorDefView;
