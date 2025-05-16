import React, { useEffect, useState } from 'react';
import DataGrid from './DataGrid';
import axios from 'axios';
import API_CONFIG from '../api/config';
import Select from './Select';
import Popup from './Popup';
import CustomPopUp from './CustomPopUp';
import Button from './Button';
import { Input } from './ui/input';
import { Checkbox } from '@radix-ui/react-checkbox';

const columns = [
  { header: 'BatchCode', accessor: 'BatchCode' as const, sortable: true, filterable: true },
  { header: 'BatchHandoverDate', accessor: 'BatchHandoverDate' as const, sortable: true, filterable: true },
  { header: 'BatchRemark', accessor: 'BatchRemark' as const, sortable: true, filterable: true },
  { header: 'HandoverGivenToUserName', accessor: 'HandoverGivenToUserName' as const, sortable: true, filterable: true },
];
const columns1 = [
  { header: 'Handover Confirmation Date', accessor: 'HandoverConfirmationDate' as const, sortable: true, filterable: true },
  { header: 'Batch Remark', accessor: 'BatchRemark' as const, sortable: true, filterable: true },
  { header: 'Generated File Code By Scan', accessor: 'GeneratedFileCode_ByScan' as const, sortable: true, filterable: true },
  { header: 'Handover Confirmation', accessor: 'HandoverConfirmation' as const, sortable: true, filterable: true },
  { header: 'File Level Remark By SP', accessor: 'FileLevelRemarkBySP' as const, sortable: true, filterable: true },
];

const TakeOverDone: React.FC = () => {
  const [getListData, setListData] = useState([]);
  const [isGridPopupOpen, setIsGridPopupOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDocumentType, setSelectedDocumentType] = useState(null);
  const [selectedDocId, setSelectedDocId] = useState(null);
  const [documentTypes, setDocumentTypes] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isCustomPopupOpen, setIsCustomPopupOpen] = useState(false);
  const [isWideSizedPopupOpen, setIsWideSizedPopupOpen] = useState(false);
  const [isWideSizedPopupOpen1, setIsWideSizedPopupOpen1] = useState(false);
  const [isTallSizedPopupOpen, setIsTallSizedPopupOpen] = useState(false);
  const closeWideSizedPopup = () => setIsWideSizedPopupOpen(false);
  const closeWideSizedPopup1 = () => setIsWideSizedPopupOpen1(false);
  const [getBatchFileHandoverListData, setBatchFileHandoverListData] = useState([]);
  const [BatchHandoverId,setBatchHandoverId]=useState('');
  const [currentPage1, setCurrentPage1] = useState(1);
  const pageSize = 4;

  // Fetch document types for dropdown
  useEffect(() => {
    const curdInput = {
      inputJson: JSON.stringify({
        DropDownType: 'MASTER',
        Type: 'DocFunctionalType',
        FilterByKey: 1,
        FilterById: null,
        IncludeAll: true,
        LocaleCode: null,
      }),
      primaryKeyId: 0,
      tableName: null,
      indexPage: '0',
      operationType: '',
      initiatedByUserOid: 'A0759F78-0C86-488E-AB8C-7E54D4C098A6',
      ApiToCall: 'DropDownMaster',
    };

    const fetchData = async () => {
      try {
        const response = await axios.post(`${API_CONFIG.BaseUrl}${API_CONFIG.BaseUrlWrapper}`, curdInput);
        setDocumentTypes(response.data);
      } catch (err) {
        console.log('Failed to fetch document types');
      }
    };

    fetchData();
  }, []);

  // Fetch grid data
  useEffect(() => {
    const curdInput = {
      inputJson: JSON.stringify({
        localeCode: 'en',
        OrgEntityKey: null,
        ProjectId:2,
        TableDefId: null,
        ProcessStatusKey: 'TAK',
        ReadyToHandover: true,
      }),
      primaryKeyId: 0,
      tableName: 'BatchHandover',
      indexPage: '2',
      operationType: 'SEL',
      initiatedByUserOid: 'a0759f78-0c86-488e-ab8c-7e54d4c098a6',
      ApiToCall: 'CRUD',
    };
    console.log(curdInput);
    const fetchData = async () => {
      try {
        const response = await axios.post(`${API_CONFIG.BaseUrl}${API_CONFIG.BaseUrlWrapper}`, curdInput);
        console.log(response.data);
        setListData(response.data);      
      } catch (err) {
        console.log('Failed to fetch grid data');
      }
    };

    fetchData();
  }, []);

  // Dropdown change handler
  const handleChange = (selectedTableName: string) => {
    const selectedDoc = documentTypes.find((doc) => doc.TableName === selectedTableName);
    setSelectedDocumentType(selectedDoc);
    setSelectedDocId(selectedDoc?.TableDefId || null);
  };

  // Pagination
  const totalPages = Math.ceil(getListData.length / pageSize);
  const totalPages1= Math.ceil(getBatchFileHandoverListData.length / pageSize);
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
    const handlePageChange1 = (page: number) => {
    setCurrentPage1(page);
  };

  const documentTypeOptions = documentTypes.map((doc) => doc.TableName);

  const onApprovalClick=(para)=>{
    setBatchHandoverId(para);
    setIsWideSizedPopupOpen(true);
    const curdInput = {
    inputJson: JSON.stringify({
    localeCode: "en",
    OrgEntityKey:null,
    ProjectId: 2,
    TableDefId:null,
    ProcessStatusKey: "TAK",
    ReadyToHandover:false
  }),
      primaryKeyId:para,
      tableName: "BatchFileHandover",
      indexPage: '1',
      operationType: 'SEL',
      initiatedByUserOid: '58fc7151-592a-4a2c-80b2-ae5cb0b5eae3',
      ApiToCall: 'CRUD',
    };
   console.log(curdInput);
    const fetchData = async () => {
      try {
        const response = await axios.post(`${API_CONFIG.BaseUrl}${API_CONFIG.BaseUrlWrapper}`, curdInput);
        console.log(response.data);
        setBatchFileHandoverListData(response.data);       
        setIsGridPopupOpen(true);
      } catch (err) {
        console.log('Failed to fetch data');
      }
    };
    fetchData();
  }
  
  //
  const onEditBatchFileHandoverClick=(para)=>{
     setIsWideSizedPopupOpen1(true);
     const curdInput = {
      inputJson: JSON.stringify({
      ProjectId: 2,
      BatchHandoverId:BatchHandoverId,
      ProcessStatusKey: "TAK",
      BatchFileHandoverId:para,
      localeCode: "en",
  }),
      primaryKeyId:para,
      tableName: "BatchFileHandover",
      indexPage: '2',
      operationType: 'SEL',
      initiatedByUserOid: '58fc7151-592a-4a2c-80b2-ae5cb0b5eae3',
      ApiToCall: 'CRUD',
    };
   console.log(curdInput);
  }


  return (
    <div>
        <div className="mt-2 mb-2">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm">Select Document Type</span>
                  <div className="w-48">
                    <Select
                      options={documentTypeOptions}
                      placeholder="Select Document Type"
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="flex items-center pl-2">
                  <label className="flex items-center space-x-1">
                    <Input type="checkbox" className="form-checkbox h-4 w-4" />
                    <span className="font-semibold">
                      Show Ready To TakeOver Batch Only
                    </span>
                  </label>
                </div>
              </div>
            </div>

      <DataGrid
        columns={columns}
        data={getListData}
        currentPage={currentPage}
        pageSize={pageSize}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        controls={{check:true}}
        onCheck={(row) => {onApprovalClick(row.BatchHandoverId); }}/>
       <CustomPopUp 
        isOpen={isWideSizedPopupOpen} 
        onClose={closeWideSizedPopup}
        width={900}
        height={600}
        className="p-8">
     <div className="flex mt-2">
  <Button onClick={closeWideSizedPopup} className="bg-blue-600 hover:bg-blue-600 h-9 text-sm rounded-sm">Save and Submit</Button>
         <Button onClick={closeWideSizedPopup} className="bg-red-600 hover:bg-red-600 ml-2 h-9 text-sm rounded-sm">Cancel</Button>
</div>
<div className="flex mt-5">
  <div className="w-1/2 pr-2">
   <fieldset className="border border-gray-400 hover:border-gray-800 rounded-md p-2 group">
    <Input
  type="text"
  className="w-full px-2 py-1 border border-gray-300 hover:border-black"
  placeholder='Batch Level Remark By SP'
   style={{ all: 'unset', display: 'block',width: '100%',fontSize: '0.875rem'}}
/> 
  </fieldset>
  </div>
  <div className="w-1/2 pl-2 flex items-center">
    <label className="flex items-center space-x-1 w-full">
      <span>Accepted or not by SP</span>
      <input type="checkbox" className="form-checkbox h-4 w-4" />
    </label>
  </div>
</div>
<div className='mt-5'>
     <fieldset className="border border-gray-300 p-4 rounded-sm">
          <legend className="text-base text-lg font-normal text-gray-800 px-1">Batch Files</legend>
            <DataGrid 
            columns={columns1}
            data={getBatchFileHandoverListData}
            currentPage={currentPage1}
            pageSize={pageSize}
            totalPages={totalPages1}
            onPageChange={handlePageChange1}
            controls={{edit:true}}
            onEdit={(row) => { onEditBatchFileHandoverClick(row.BatchFileHandoverId); }}
            />
          </fieldset>
     </div>
      </CustomPopUp>

        <CustomPopUp 
        isOpen={isWideSizedPopupOpen1} 
        onClose={closeWideSizedPopup1}
        width={700}
        height={300}
        showCloseButton={false}
        className="p-8">
       <h2 className="text-xl font-semibold">Batch Files</h2>
        <div className="flex mt-2">
         {/* <Button onClick={closeWideSizedPopup1} className="bg-blue-700 hover:bg-blue-700 h-10 ">Save and Submit</Button>
         <Button onClick={closeWideSizedPopup1} className="bg-red-600 hover:bg-red-600 ml-2 h-10">Cancel</Button> */}
         <Button onClick={closeWideSizedPopup1} className="bg-blue-600 hover:bg-blue-600 h-9 text-sm rounded-sm">Save and Submit</Button>
         <Button onClick={closeWideSizedPopup1} className="bg-red-600 hover:bg-red-600 ml-2 h-9 text-sm rounded-sm">Cancel</Button>
        </div>
        <fieldset className="border border-gray-300 p-4 rounded-sm mt-5">
          <legend className="text-base text-lg font-normal text-gray-800 px-1">Batch Files</legend>
          <div className="flex mt-5 mb-5">
  <div className="w-1/2 pr-2">
  <fieldset className="border border-gray-400 hover:border-gray-800 rounded-md p-2 group">
    <Input
  type="text"
  className="w-full px-2 py-1 border border-gray-300 hover:border-black"
  placeholder='File Level Remark By SP'
   style={{ all: 'unset', display: 'block',width: '100%',fontSize: '0.875rem'}}
/> 
  </fieldset>
  </div>
  <div className="w-1/2 pl-2 flex items-center">
    <label className="flex items-center space-x-1 w-full">
      <span>Accepted or not by SP</span>
      <input type="checkbox" className="form-checkbox h-4 w-4" />
    </label>
  </div>
</div>
        </fieldset>

      </CustomPopUp>

    </div>
  );
};

export default TakeOverDone;
