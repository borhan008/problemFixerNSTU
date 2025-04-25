import React, { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { auth } from "../../../../firebase";
import axios from "axios";
import { toast } from "sonner";

export const Resolve = () => {
  const { complaint_id } = useParams();
  const [count, setCount] = useState(-1);

  if (Number.isNaN(parseInt(complaint_id)))
    return <Navigate to="/admin/complaint"></Navigate>;

  const [complaints, setComplaints] = useState({});

  const backendURL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const token = await auth?.currentUser?.getIdToken();
      const complaints = await axios.get(
        `${backendURL}/admin/complaint/${complaint_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setComplaints(...complaints.data.complaints);
      setCount(complaints.data.count);
      console.log(complaints.data.complaints);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong while fetchig complaints");
    }
  };

  return (
    <>
      {count === 1 ? (
        <div className="grid grid-cols-2 gap-2 w-full mx-auto">
          <div className="">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Resolve a Complaint
            </h2>
            <form action="">
              <div className="mb-4 space-y-1">
                <Label htmlFor="description">Details</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the issue in detail"
                  rows={20}
                  required
                  className="min-h-64"
                />
              </div>
              <div className="flex gap-2 items-end">
                <div>
                  <Label htmlFor="date" className="mb-1">
                    Estimated Date
                  </Label>
                  <Input
                    id="date"
                    placeholder="Describe the issue in detail"
                    type="date"
                    className="max-w-34 mb-0 pb-0"
                  />
                </div>
                <div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline">
                        Assign Specific Employee
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-lg">
                      <DialogHeader>
                        <DialogTitle>Search Employee</DialogTitle>
                        <DialogDescription>
                          Make changes to your profile here. Click save when
                          you're done.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="flex gap-2">
                        <div className="w-full">
                          <Input id="name" className="col-span-3" />
                        </div>
                        <div>
                          <Select>
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="Select a fruit" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectLabel>Fruits</SelectLabel>
                                <SelectItem value="apple">Apple</SelectItem>
                                <SelectItem value="banana">Banana</SelectItem>
                                <SelectItem value="blueberry">
                                  Blueberry
                                </SelectItem>
                                <SelectItem value="grapes">Grapes</SelectItem>
                                <SelectItem value="pineapple">
                                  Pineapple
                                </SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit">Save changes</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
              <Button variant="default" className="mt-4" type="submit">
                Submit
              </Button>
            </form>
          </div>
          <div className="sticky top-16 h-[calc(100vh-150px)] overflow-y-auto p-4 bg-white scrollbar-thin rounded-2xl shadow-md space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800">
              {complaints.complaint_title}
            </h2>

            <div className="flex items-center gap-2">
              <Badge variant="outline">
                {complaints.ComplaintCataegory.complaint_cat_name}
              </Badge>
              <span className="text-sm text-gray-500">
                Created :{" "}
                {new Date(complaints.createdAt.toString()).toLocaleString()},
              </span>
              <span className="text-sm text-gray-500">
                Last Updated :{" "}
                {new Date(complaints.updatedAt.toString()).toLocaleString()}
              </span>
            </div>
            <div className="prose prose-sm max-w-none text-gray-700">
              <strong>Summary:</strong>{" "}
              <p className="italic">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia,
                sed? Incidunt iusto totam sint atque. Voluptatibus aspernatur
                aperiam eum ipsum!
              </p>
            </div>
            <div className="mt-2 border-t border-gray-200 pt-4">
              <h3 className="text-lg font-medium text-gray-900">
                {complaints.User.name},{" "}
                <span className="font-normal text-gray-600 capitalize">
                  {complaints?.User?.Profession?.profession_name || "Undefined"}
                </span>
                {complaints?.User?.Profession?.profession_name.toLowerCase() ===
                  "student" && (
                  <span className="font-normal text-gray-700 uppercase text-body2">
                    {", "}
                    {complaints?.User?.roll || ""}
                  </span>
                )}
              </h3>
              <p className="text-sm text-gray-600">
                {complaints?.User?.Department?.dept_full_name}
              </p>
              <p className="text-sm text-gray-600">
                {" "}
                {complaints?.User?.mobile}
              </p>
              <p className="text-sm text-blue-600 underline">
                {complaints?.User?.email}
              </p>
            </div>

            <div className="prose prose-sm max-w-none text-gray-700">
              <p>{complaints?.complaint_description}</p>
            </div>
          </div>
        </div>
      ) : count === -1 ? (
        <div>Loading..</div>
      ) : (
        <div>Not found</div>
      )}
    </>
  );
};
