import React, { useEffect, useState } from "react";
import { FileText, Save } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import axios from 'axios';
import API_CONFIG from '../api/config';
import ComPopup from "./ComPopup";
import DataGrid from "./DataGrid";
import Popup from "./Popup";

interface DocumentCardProps {
  batchGenerationId: string;
  batchCode: string;
  date: string;
  remark: string;
  tableName: string;
  totalRecords: number;
  projectId: string;
  tableDefId: string;
  onSelect: (batchGenerationId: string, isSelected: boolean) => void;
  isSelected: boolean;
}

const columns = [
  {
    header: 'BatchFileSrNo',
    accessor: 'batchFileNo' as const,
    sortable: true,
    filterable: true
  },
  {
    header: 'GeneratedBatchCode',
    accessor: 'generatedBatchCode' as const,
    sortable: true,
    filterable: true
  },
  {
    header: 'GeneratedFileCode',
    accessor: 'generatedFileCode' as const,
    sortable: true,
    filterable: true
  },
  {
    header: 'BatchFileRemark',
    accessor: 'batchFileRemark' as const,
    sortable: true,
    filterable: true
  },
];

const DocumentCard: React.FC<DocumentCardProps> = ({
  batchGenerationId,
  batchCode,
  date,
  remark,
  tableName,
  totalRecords,
  projectId,
  tableDefId,
  onSelect,
  isSelected
}) => {
  const [getListData, setListData] = useState([]);
  const [isGridPopupOpen, setIsGridPopupOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [popupOpen, setPopupOpen] = useState(false);
  const [message, setMessage] = useState('');
  const pageSize = 4;

  const onFileClick = () => {
    const curdInput = {
      inputJson: JSON.stringify({
        localeCode: "en",
        ProjectId: projectId,
        ProcessStatusKey: "HND",
      }),
      primaryKeyId: batchGenerationId,
      tableName: "BatchFileGeneration",
      indexPage: "0",
      operationType: "SEL",
      initiatedByUserOid: "a0759f78-0c86-488e-ab8c-7e54d4c098a6",
      ApiToCall: "CRUD",
    };
    const fetchData = async () => {
      try {
        const response = await axios.post(`${API_CONFIG.BaseUrl}${API_CONFIG.BaseUrlWrapper}`, curdInput);
        setListData(response.data.map(item => ({
          batchFileNo: item.BatchFileSrNo,
          generatedBatchCode: item.GeneratedBatchCode,
          generatedFileCode: item.GeneratedFileCode,
          batchFileRemark: item.BatchFileRemark,
        })));
        setIsGridPopupOpen(true);
      } catch (err) {
        console.log('Failed to fetch data');
      }
    };
    fetchData();
  };

  const totalPages = Math.ceil(getListData.length / pageSize);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const onSaveClick = () => {
    const curdInput = {
      inputJson: JSON.stringify({
        InputList: [
          {
            BatchGenerationId: batchGenerationId,
            BatchGenerationDate: date,
            BatchCode: batchCode,
            BatchRemark: remark,
            DocTypeName: tableName,
            ProjectId: projectId,
            TotalRecords: totalRecords,
            localeCode: null,
            OrgEntityKey: null
          }
        ],
        OrgEntityKey: null,
        localeCode: null
      }),
      primaryKeyId: 0,
      tableName: "BatchHandover",
      indexPage: "0",
      operationType: "INS",
      initiatedByUserOid: "a0759f78-0c86-488e-ab8c-7e54d4c098a6",
      ApiToCall: "CRUD",
    };
    const fetchData = async () => {
      try {
        const response = await axios.post(`${API_CONFIG.BaseUrl}${API_CONFIG.BaseUrlWrapper}`, curdInput);
        setMessage("Record inserted successfully");
        setPopupOpen(true);
      } catch (err) {
        console.log('Failed to fetch data');
      }
    };
    fetchData();
  };

  const handleCheckboxChange = () => {
    onSelect(batchGenerationId, !isSelected);
  };

  return (
    <div className="bg-white p-4 rounded-md shadow-sm border">
      <div className="flex justify-between items-start mb-2">
        <div className="bg-black text-white px-2 py-1 text-xs rounded">
          {batchCode}
        </div>
        <div className="text-pink-500 text-xs">{date}</div>
      </div>
      <div className="mb-4">
        <h3 className="font-medium">{remark}</h3>
        <div className="flex justify-between items-center mt-1">
          <span className="text-gray-600 text-sm">{tableName}</span>
          <span className="text-gray-600 text-sm">{totalRecords}</span>
        </div>
      </div>
      <div className="flex items-center justify-between pt-2 border-t">
        <div className="flex items-center gap-2">
          <Checkbox
            id={`handover-${batchCode}`}
            checked={isSelected}
            onCheckedChange={handleCheckboxChange}
          />
          <label
            htmlFor={`handover-${batchCode}`}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            To HandOver
          </label>
        </div>
        <div className="flex gap-2">
          <button className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700" onClick={onSaveClick}>
            <Save className="h-4 w-4" />
          </button>
          <button className="p-2 bg-pink-600 text-white rounded-full hover:bg-pink-700" onClick={onFileClick}>
            <FileText className="h-4 w-4" />
          </button>
        </div>
      </div>

      <ComPopup
        isOpen={isGridPopupOpen}
        onClose={() => setIsGridPopupOpen(false)}
        title="Batch Files Data"
        size="lg"
      >
        <DataGrid
          columns={columns}
          data={getListData}
          currentPage={currentPage}
          pageSize={pageSize}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </ComPopup>

      <Popup
        message={message}
        isOpen={popupOpen}
        onClose={() => setPopupOpen(false)}
      />
    </div>
  );
};

export default DocumentCard;