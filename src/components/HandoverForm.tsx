import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import axios from 'axios';
import API_CONFIG from '../api/config';

interface HandoverFormProps {
  BatchHandoverId:number;
}

const HandoverForm: React.FC<HandoverFormProps> = ({BatchHandoverId
}) => {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [BatchHandoverById,setBatchHandoverById]=useState([]);
  const [project,setProject]=useState('');
  const [projectWorkOrders,setProjectWorkOrders]=useState('');
  const [batchHandoverDate,setBatchHandoverDate]=useState('');
  const [handoverInitiatedByUser,setHandoverInitiatedByUser]=useState('');
  const [handoverGivenToUser,setHandoverGivenToUser]=useState('');
  const [batchGeneration,setBatchGeneration]=useState('');
  const [batchGenerationByScan,setBatchGenerationByScan]=useState('');
  const [initiationRemark,setInitiationRemark]=useState('');
  const [supportingDocument,setSupportingDocument]=useState('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted");
  };

   useEffect(() => {
   console.log(BatchHandoverId);
   const curdInput = {
  inputJson: JSON.stringify({
    localeCode: "en",
    OrgEntityKey:null,
    ProjectId: 2,
    TableDefId:null,
    BatchHandoverId:BatchHandoverId,
    ProcessStatusKey: "HND",
    ReadyToTakeover:false
  }),
  primaryKeyId: BatchHandoverId,
  tableName: "BatchHandover",
  indexPage: "1",
  operationType: "SEL",
  initiatedByUserOid: "a0759f78-0c86-488e-ab8c-7e54d4c098a6",
  ApiToCall: "CRUD",
};
    console.log(curdInput);
    const fetchData = async () => {
      try {
        const response = await axios.post(`${API_CONFIG.BaseUrl}${API_CONFIG.BaseUrlWrapper}`, curdInput);
         console.log(response.data);
        setBatchHandoverById(response.data.map(item =>{
          //setProjectWorkOrders(item);
          setBatchGeneration(item.BatchRemark);
          setInitiationRemark(item.BatchFileRemark);
          setBatchGenerationByScan(item.BatchCode_ByScan)
        }))
        // setListData(response.data.map(item => ({
        //   batchFileNo: item.BatchFileSrNo,
        //   generatedBatchCode: item.GeneratedBatchCode,
        //   generatedFileCode: item.GeneratedFileCode,
        //   batchFileRemark: item.BatchFileRemark,
        // })));
        //console.log(response.data);
      } catch (err) {
        console.log('Failed to fetch data');
      }
    };
    fetchData();


   }, [])

  return (
    <div className="w-full bg-white rounded-lg overflow-hidden mx-auto">
      <div className="p-5">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <fieldset className="border border-gray-400 hover:border-gray-800 rounded-md p-3 group">
  <legend className="text-xs text-gray-500 px-1">Project</legend>
  <Input 
    type="text" 
    value={project}
    style={{ all: 'unset', display: 'block',width: '100%',fontSize: '0.875rem'}}
  />
</fieldset>
            
            <fieldset className="border border-gray-400 hover:border-gray-800 rounded-md p-3 group">
              <legend className="text-xs text-gray-500 px-1">Project Work Orders</legend>
              <Input 
                type="text" 
                value={projectWorkOrders} 
                 style={{ all: 'unset', display: 'block',width: '100%',fontSize: '0.875rem'}}/>
            </fieldset>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <fieldset className="border border-gray-400 hover:border-gray-800 rounded-md p-3 group">
              <legend className="text-xs text-gray-500 px-1">Handover Initiated By User</legend>
              <Input 
                type="text"               
                value={handoverInitiatedByUser}
                 style={{ all: 'unset', display: 'block',width: '100%',fontSize: '0.875rem'}}
              />
            </fieldset>

            <fieldset className="border border-gray-400 hover:border-gray-800 rounded-md p-3 group">
              <legend className="text-xs text-gray-500 px-1">Batch Handover Date</legend>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal border-0 p-0 h-7 text-sm hover:border-b hover:border-gray-400 transition-colors focus-visible:ring-0",
                      !date && "text-muted-foreground"
                    )}
                  >
                    {date ? format(date, "PPP") : <span>Select date</span>}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </fieldset>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <fieldset className="border border-gray-400 hover:border-gray-800 rounded-md p-3 group">
              <legend className="text-xs text-gray-500 px-1">Handover Given To User</legend>
              <Select>
                <SelectTrigger className="border-0 p-0 h-7 text-sm hover:border-b hover:border-gray-400 transition-colors focus-visible:ring-0">
                  <SelectValue defaultValue={handoverGivenToUser}/>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user1">Administrator</SelectItem>
                  <SelectItem value="user2">Project Manager</SelectItem>
                  <SelectItem value="user3">Record Clerk</SelectItem>
                </SelectContent>
              </Select>
            </fieldset>

            <fieldset className="border border-gray-400 hover:border-gray-800 rounded-md p-3 group">
              <legend className="text-xs text-gray-500 px-1">Initiation Remark</legend>
              <Input 
                type="text" 
                value={initiationRemark}
                 style={{ all: 'unset', display: 'block',width: '100%',fontSize: '0.875rem'}}
                 readOnly
              />
            </fieldset>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <fieldset className="border border-gray-400 hover:border-gray-800 rounded-md p-3 group">
              <legend className="text-xs text-gray-500 px-1">Batch Generation</legend>
              <Input 
                type="text" 
                value={batchGeneration}
                style={{ all: 'unset', display: 'block',width: '100%',fontSize: '0.875rem'}}
                readOnly
              />
            </fieldset>
            <fieldset className="border border-gray-400 hover:border-gray-800 rounded-md p-3 group">
              <legend className="text-xs text-gray-500 px-1">Batch Generation by Scan</legend>
              <Input 
                type="text" 
                value={batchGenerationByScan}
                  style={{ all: 'unset', display: 'block',width: '100%',fontSize: '0.875rem'}}
                  readOnly
                  />
            </fieldset>
          </div>
          
          <fieldset className="border border-gray-400 hover:border-gray-800 rounded-md p-3">
            <legend className="text-xs text-gray-500 px-1">Supporting Document</legend>
            <div className="flex items-center">
              <Input
                type="file"
                id="fileInput"
                className="hidden"
                onChange={handleFileChange}
              />
              <label
                htmlFor="fileInput"
                className="px-2 py-1 text-xs bg-gray-200 hover:bg-gray-300 rounded cursor-pointer mr-2"
              >
                Choose File
              </label>
              <span className="text-xs text-gray-500">
                {selectedFile ? selectedFile.name : "No file chosen"}
              </span>
            </div>
          </fieldset>

  <div className="flex gap-2 justify-center">
  <Button
    type="submit"
    className="w-[160px] bg-green-600 hover:bg-green-700 rounded-sm px-4 py-2 text-sm text-white"
  >
    Update and Submit
  </Button>
  <Button
    type="button"
    variant="destructive"
    className="w-[160px] rounded-sm px-4 py-2 text-sm"
  >
    Cancel
  </Button>
</div>

        </form>
      </div>
    </div>
  );
};

export default HandoverForm;