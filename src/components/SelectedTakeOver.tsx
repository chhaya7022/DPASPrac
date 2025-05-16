import React, { useEffect, useState } from 'react';
import DataGrid from './DataGrid';
import Select from "./Select";
import Button from "./Button";
import axios from 'axios';
import API_CONFIG from '../api/config';
import HandoverForm from './HandoverForm';
import ComPopup from './ComPopup';
import HandoverFormDialog from './HandoverModal';
import Popup from './Popup';
import DataGridCheckBox from './DataGridCheckBox';
import HandoverModal from './HandoverModal';
import { useToast } from '@/hooks/use-toast';
import { Input } from './ui/input';


const columns = [
  { header: 'Batch Code By Scan', accessor: 'BatchCode_ByScan' as const, sortable: true, filterable: true },
  { header: 'BatchCode', accessor: 'BatchCode' as const, sortable: true, filterable: true },
  { header: 'BatchRemark', accessor: 'BatchRemark' as const, sortable: true, filterable: true },
];

const columns1 = [
  { header: 'GeneratedFileCode_ByScan', accessor: 'GeneratedFileCode_ByScan' as const, sortable: true, filterable: true },
  { header: 'BatchFilePoolAllocated', accessor: 'HandoverConfirmation' as const, sortable: true, filterable: true },
  { header: 'AllocationDate Time', accessor: 'HandoverConfirmationDate' as const, sortable: true, filterable: true },
];


const SelectedTakeOver: React.FC = () => {
  const [message,setMessage]=useState('');
  const [getBatchHandoverListData, setListData] = useState([]);
  const [getBatchFileHandoverListData, setBatchFileHandoverListData] = useState([]);
  const [isGridPopupOpen, setIsGridPopupOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPage1, setCurrentPage1] = useState(1);
  const [selectedDocumentType, setSelectedDocumentType] = useState(null);
  const [selectedDocId, setSelectedDocId] = useState(null);
  const [documentTypes, setDocumentTypes] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [userOptions,setuserOptions]=useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [popupOpen, setPopupOpen] = useState(false);
  const [BatchHandoverId,setBatchHandoverId]=useState(0);
  const [selectedDocumentIds, setSelectedDocumentIds] = useState<string[]>([]);
  const [selectedRowsList, setSelectedRowsList] = useState([]);
  const { toast } = useToast();
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

  // Dropdown change handler
  const handleChange = (selectedTableName: string) => {
    const selectedDoc = documentTypes.find((doc) => doc.TableName === selectedTableName);
    setSelectedDocumentType(selectedDoc);
    setSelectedDocId(selectedDoc?.TableDefId || null);
  };

   // Fetch grid data
  useEffect(() => {
    const curdInput = {
      inputJson: JSON.stringify({
        localeCode: 'en',
        OrgEntityKey: null,
        ProjectId:2,
        TableDefId: selectedDocId,
        ProcessStatusKey: 'TAK',
        ReadyToHandover: false,
      }),
      primaryKeyId: 0,
      tableName: 'BatchHandover',
      indexPage: '1',
      operationType: 'SEL',
      initiatedByUserOid: 'a0759f78-0c86-488e-ab8c-7e54d4c098a6',
      ApiToCall: 'CRUD',
    };
    console.log(curdInput);
    const fetchData = async () => {
      try {
        const response = await axios.post(`${API_CONFIG.BaseUrl}${API_CONFIG.BaseUrlWrapper}`, curdInput);
        setListData(response.data);   
        console.log(response.data);
      } catch (err) {
        console.log('Failed to fetch grid data');
      }
    };
    fetchData();
  }, [selectedDocId]);
  
  
    //userOptionsdropdown
      useEffect(() => {
        const curdInput = {
          inputJson: JSON.stringify({
            DropDownType: "MASTER",
            Type: "User", 
            FilterByKey: 1,
            FilterById: null,
            IncludeAll: true,
            LocaleCode: null
          }),
          primaryKeyId: 0,
          tableName: null,
          indexPage: '0',
          operationType: '',
          initiatedByUserOid: 'A0759F78-0C86-488E-AB8C-7E54D4C098A6',
          ApiToCall: 'DropDownMaster'
        };
        const fetchData = async () => {
          try {
            const response = await axios.post(`${API_CONFIG.BaseUrl}${API_CONFIG.BaseUrlWrapper}`, curdInput);
            setuserOptions(response.data); 
          } catch (err) {
            console.log('Failed to fetch data');
          }
        };
        fetchData();
      }, [selectedDocumentType])
      const userOptionsTypeOptions = userOptions.map(doc => doc.UserName);
      const handleChangeUser = (selectedUserName) => {
        const selectedUser = userOptions.find(doc => doc.UserName === selectedUserName);
        setSelectedUser(selectedUser);
        setSelectedUserId(selectedUser?.Oid); 
       // console.log(selectedUser);
      };


  // Pagination 
  const totalPages = Math.ceil(getBatchHandoverListData.length / pageSize);
  const totalPages1= Math.ceil(getBatchFileHandoverListData.length / pageSize);
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  const handlePageChange1 = (page: number) => {
    setCurrentPage1(page);
  };

  const documentTypeOptions = documentTypes.map((doc) => doc.TableName);
  
  //Edit 
  const onEditClick=(id)=>{
   setBatchHandoverId(id);
   setIsModalOpen(true);
  }
  
  //View
  const onViewClick=(id)=>{
    const curdInput = {
    inputJson: JSON.stringify({
    localeCode: "en",
    OrgEntityKey:null,
    ProjectId: 2,
    TableDefId:null,
    ProcessStatusKey: "TAK",
    ReadyToHandover:false
  }),
      primaryKeyId:id,
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
};

//Revert
const onRevertEventClick=(id)=>{
    const curdInput = {
    inputJson: JSON.stringify({
    localeCode: "en",
    OrgEntityKey:null,
    ProjectId: 2,
    TableDefId:null,
    ProcessStatusKey: "TAK",
    ReadyToHandover:false
  }),
      primaryKeyId:id,
      tableName: "BatchHandover",
      indexPage: '1',
      operationType: 'DEL',
      initiatedByUserOid: '58fc7151-592a-4a2c-80b2-ae5cb0b5eae3',
      ApiToCall: 'CRUD',
    };
   console.log(curdInput);
    const fetchData = async () => {
      try {
        const response = await axios.post(`${API_CONFIG.BaseUrl}${API_CONFIG.BaseUrlWrapper}`, curdInput);
        console.log(response.data);
        setMessage("Record Reverted successfully");
        setPopupOpen(true);
      } catch (err) {
        console.log('Failed to fetch data');
      }
    };
    fetchData();
}

const onBulkHandOver = () => {
  if (selectedRowsList.length === 0) {
    toast({
      title: "No Selection",
      description: "Please select at least one document for handover",
      variant: "destructive",
    });
    return;
  }

  if (!selectedUserId) {
    toast({
      title: "No User Selected",
      description: "Please select a user for handover",
      variant: "destructive",
    });
    return;
  }
    
  selectedRowsList.map(doc=>{
const batchList = [
      {
        BatchGenerationId: doc.BatchGenerationId,
        BatchGenerationDate: doc.BatchGenerationDate,
        BatchCode: doc.BatchCode,
        BatchRemark: doc.BatchRemark,
        DocTypeName: doc.TableName,
        ProjectId: doc.ProjectId,
        TotalRecords: doc.TotalRecords,
        localeCode: null,
        OrgEntityKey: null,
        HandOverToUserOid: selectedUserId,
      },
    ];
    const curdInput = {
      inputJson: JSON.stringify({
        InputList: batchList,
       // OrgEntityKey: null,
        //localeCode: null,
       // HandOverToUserOid: selectedUserId,
      }),
      primaryKeyId: 0,
      tableName: "BatchHandover",
      indexPage: "0",
      operationType: "INS",
      initiatedByUserOid: "a0759f78-0c86-488e-ab8c-7e54d4c098a6",
      ApiToCall: "CRUD",
    };
     console.log(curdInput);
    axios
      .post(`${API_CONFIG.BaseUrl}${API_CONFIG.BaseUrlWrapper}`, curdInput)
      .then((response) => {
        setMessage("Records inserted successfully");
        setPopupOpen(true);
      })
      .catch((err) => {
        console.error("Failed to handover:", err);
        toast({
          title: "Error",
          description: `Failed to handover Batch ${doc.BatchCode}`,
          variant: "destructive",
        });
      });
  });
  // Clear selections after handover
  setSelectedDocumentIds([]);
};

  return (
    <div>
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

      <DataGridCheckBox
  columns={columns}
  data={getBatchHandoverListData}
  currentPage={currentPage}
  pageSize={pageSize}
  totalPages={totalPages}
  onPageChange={handlePageChange}
  controls={{ edit: true, view: true, delete: false, revert: true }}
  onEdit={(row) => { onEditClick(row.BatchHandoverId); }}
  onView={(row) => { onViewClick(row.BatchHandoverId); }}
  onRevert={(row) => { onRevertEventClick(row.BatchHandoverId); }}
  onSelectionChange={(selectedRows) => {setSelectedRowsList(selectedRows)}}
  striped
  hoverable
/>

      </div>

      <div className="mt-5 mb-2 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="whitespace-nowrap text-sm">HandOver Given To User:</span>
          <div className="w-48">
            <Select
              options={userOptionsTypeOptions}
              placeholder="Select User"
              onChange={handleChangeUser}
            />
          </div>
        </div>
        <Button
          size="sm"
          className="bg-blue-500 hover:bg-blue-600 text-white" onClick={onBulkHandOver}>
          Bulk HandOver
        </Button>
      </div>
         <HandoverModal BatchHandoverId={BatchHandoverId}
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

        <ComPopup 
          isOpen={isGridPopupOpen}
          onClose={() => setIsGridPopupOpen(false)}
          title="Batch Files Data"
          size="lg">
          <DataGrid 
            columns={columns1}
            data={getBatchFileHandoverListData}
            currentPage={currentPage1}
            pageSize={pageSize}
            totalPages={totalPages1}
            onPageChange={handlePageChange1}/>
        </ComPopup>
         <Popup
                message={message}
                isOpen={popupOpen}
                onClose={() => setPopupOpen(false)}
          />
    </div>
  );
};

export default SelectedTakeOver;
