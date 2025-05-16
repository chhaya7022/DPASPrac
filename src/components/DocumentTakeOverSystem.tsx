import React, { useEffect, useState } from "react";
import Header from "./Header";
import Pagination from "./Pagination";
import Select from "./Select";
import Button from "./Button";
import Banner from "./Banner";
import axios from "axios";
import API_CONFIG from "../api/config";
import { useToast } from "@/components/ui/use-toast";
import Popup from "./Popup";
import TabNavigationForTakeOver from "./TabNavigationForTakeOver";
import { Input } from "./ui/input";
import SelectedTakeOver from "./SelectedTakeOver";
import TakeOverDone from "./TakeOverDone";
import DocumentCardForTakeOver from "./DocumentCardForTakeOver";

interface DocumentTakeOverSystemProps {
  batchGenerationId: string;
  batchCode: string;
  date: string;
  remark: string;
  tableName: string;
  totalRecords: number;
  projectId: string;
  tableDefId: string;
}

const DocumentTakeOverSystem: React.FC = () => {
  const [activeTab, setActiveTab] = useState("available");
  const [activeTab1, setActiveTab1] = useState("selected");
  const [currentPage, setCurrentPage] = useState(1);
  const [mockDocuments, setMockDocuments] = useState<any[]>([]);
  const [selectedDocumentType, setSelectedDocumentType] = useState(null);
  const [selectedDocId, setSelectedDocId] = useState(null);
  const [documentTypes, setDocumentTypes] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [userOptions, setuserOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [popupOpen, setPopupOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [projectId, setprojectId] = useState("");
  const [selectedDocumentIds, setSelectedDocumentIds] = useState<string[]>([]);

  const itemsPerPage = 8;

  // Document dropdown
  useEffect(() => {
    const curdInput = {
      inputJson: JSON.stringify({
        DropDownType: "MASTER",
        Type: "DocFunctionalType",
        FilterByKey: 1,
        FilterById: null,
        IncludeAll: true,
        LocaleCode: null,
      }),
      primaryKeyId: 0,
      tableName: null,
      indexPage: "0",
      operationType: "",
      initiatedByUserOid: "A0759F78-0C86-488E-AB8C-7E54D4C098A6",
      ApiToCall: "DropDownMaster",
    };
    const fetchData = async () => {
      try {
        const response = await axios.post(
          `${API_CONFIG.BaseUrl}${API_CONFIG.BaseUrlWrapper}`,
          curdInput
        );
        setDocumentTypes(response.data);
      } catch (err) {
        console.log("Failed to fetch data");
      }
    };
    fetchData();
  }, []);
  const documentTypeOptions = documentTypes.map((doc) => doc.TableName);
  const handleChange = (selectedTableName) => {
    const selectedDoc = documentTypes.find(
      (doc) => doc.TableName === selectedTableName
    );
    setSelectedDocumentType(selectedDoc);
    setSelectedDocId(selectedDoc?.TableDefId);
  };

  // User options dropdown
  useEffect(() => {
    const curdInput = {
      inputJson: JSON.stringify({
        DropDownType: "MASTER",
        Type: "User",
        FilterByKey: 1,
        FilterById: null,
        IncludeAll: true,
        LocaleCode: null,
      }),
      primaryKeyId: 0,
      tableName: null,
      indexPage: "0",
      operationType: "",
      initiatedByUserOid: "A0759F78-0C86-488E-AB8C-7E54D4C098A6",
      ApiToCall: "DropDownMaster",
    };
    const fetchData = async () => {
      try {
        const response = await axios.post(
          `${API_CONFIG.BaseUrl}${API_CONFIG.BaseUrlWrapper}`,
          curdInput
        );
        setuserOptions(response.data);
      } catch (err) {
        console.log("Failed to fetch data");
      }
    };
    fetchData();
  }, [selectedDocumentType]);
  const userOptionsTypeOptions = userOptions.map((doc) => doc.UserName);
  const handleChangeUser = (selectedUserName) => {
    const selectedUser = userOptions.find(
      (doc) => doc.UserName === selectedUserName
    );
    setSelectedUser(selectedUser);
    setSelectedUserId(selectedUser?.Oid);
  };

  // Fetch documents
  useEffect(() => {
    const curdInput = {
      //inputJson: `{"TableDefId":${selectedDocId},"ProcessStatusKey":"HND","ReadyToHandover":true}`,
      inputJson: JSON.stringify({
      localeCode: "en",
      //OrgEntityKey:null,  
      // ProjectId: 2,
      TableDefId:selectedDocId,
      ProcessStatusKey: "TAK",
     // ReadyToTakeover:false,
  }),
      primaryKeyId: 0,
      tableName: "BatchGeneration",
      indexPage: "0",
      operationType: "SEL",
      initiatedByUserOid: "58fc7151-592a-4a2c-80b2-ae5cb0b5eae3",
      ApiToCall: "CRUD",
    };
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.post(
          `${API_CONFIG.BaseUrl}${API_CONFIG.BaseUrlWrapper}`,
          curdInput
        );
        if (Array.isArray(response.data)) {
          setMockDocuments(response.data);
        } else {
          setMockDocuments([]);
          toast({
            title: "Data Error",
            description: "Received invalid data format from server",
            variant: "destructive",
          });
          console.log("API Response is not an array:", response.data);
        }
      } catch (err) {
        setMockDocuments([]);
        toast({
          title: "Error",
          description: "Failed to fetch data",
          variant: "destructive",
        });
        console.log("Failed to fetch data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedDocId, toast]);

  // Handle document selection
  const handleDocumentSelect = (
    batchGenerationId: string,
    isSelected: boolean
  ) => {
    setSelectedDocumentIds((prev) => {
      if (isSelected) {
        return [...prev, batchGenerationId];
      } else {
        return prev.filter((id) => id !== batchGenerationId);
      }
    });
  };

  // Calculate pagination
  const totalItems = Array.isArray(mockDocuments) ? mockDocuments.length : 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const getCurrentPageItems = () => {
    if (!Array.isArray(mockDocuments)) return [];
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return mockDocuments.slice(startIndex, endIndex);
  };
  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Bulk Handover Click
  const onBulkHandOverClick = () => {
    if (selectedDocumentIds.length === 0) {
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
    selectedDocumentIds.forEach((batchGenerationId) => {
      const doc = mockDocuments.find(
        (d) => d.BatchGenerationId === batchGenerationId
      );
      if (doc) {
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
          },
        ];
        const curdInput = {
          inputJson: JSON.stringify({
            InputList: batchList,
            OrgEntityKey: null,
            localeCode: null,
            HandOverToUserOid: selectedUserId,
          }),
          primaryKeyId: 0,
          tableName: "BatchHandover",
          indexPage: "0",
          operationType: "INS",
          initiatedByUserOid: "a0759f78-0c86-488e-ab8c-7e54d4c098a6",
          ApiToCall: "CRUD",
        };
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
      }
    });
    // Clear selections after handover
    setSelectedDocumentIds([]);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />
      <main className="container mx-auto px-4 pt-20 pb-2 flex-1 overflow-auto">
        <Banner title="Batch Handover" className="mt-1" />
        <TabNavigationForTakeOver
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        {activeTab === "available" && (
          <>
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
            {loading ? (
              <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/20">
                <div className="animate-spin h-6 w-6 border-2 border-t-transparent border-blue-500 rounded-full"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {getCurrentPageItems().length > 0 ? (
                  getCurrentPageItems().map((doc) => (
                    <DocumentCardForTakeOver
                      key={doc.BatchGenerationId}
                      batchGenerationId={doc.BatchGenerationId}
                      batchCode={doc.BatchCode || "N/A"}
                      date={doc.BatchGenerationDate || "N/A"}
                      remark={doc.BatchRemark || "N/A"}
                      tableName={doc.TableName || "N/A"}
                      totalRecords={doc.TotalRecords || 0}
                      projectId={doc.ProjectId}
                      tableDefId={doc.TableDefId}
                      onSelect={handleDocumentSelect}
                      isSelected={selectedDocumentIds.includes(
                        doc.BatchGenerationId
                      )}
                    />
                  ))
                ) : (
                  <div className="col-span-full text-center py-8">
                    <p>No documents available</p>
                  </div>
                )}
              </div>
            )}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages > 0 ? totalPages : 1}
              onPageChange={onPageChange}
            />
            <div className="mt-3 mb-2 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="whitespace-nowrap text-sm">
                  HandOver Given To User:
                </span>
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
                className="bg-blue-500 hover:bg-blue-600 text-white"
                onClick={onBulkHandOverClick}>
                Bulk HandOver
              </Button>
            </div>
          </>
        )}

        {activeTab === "selected" && (
          <div>
            <SelectedTakeOver/>
          </div>
        )}

        {activeTab === "done" && (
          <div>
            <TakeOverDone/>
          </div>
        )}
      </main>
      <Popup
        message={message}
        isOpen={popupOpen}
        onClose={() => setPopupOpen(false)}
      />
    </div>
  );
};

export default DocumentTakeOverSystem;
