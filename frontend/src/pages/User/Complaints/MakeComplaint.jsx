import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import { auth } from "../../../../firebase";
import { toast } from "sonner";

export default function MakeComplaint() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState();
  const [categories, setCategories] = useState([]);
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const [disable, setDisable] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = await auth?.currentUser?.getIdToken();
        const response = await axios.get(`${backendURL}/complaint/category`, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
        console.log(response.data.categories);
        setCategories(response.data.categories);
      } catch (error) {
        console.log(error);
        toast.error("Failed to reloading categories.");
      }
    };

    fetchCategories();
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setDisable(true);
    try {
      const token = await auth?.currentUser?.getIdToken();

      const res = await axios.post(
        `${backendURL}/complaint`,
        {
          title,
          description,
          complaint_cat_id: category,
        },
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
      toast("A complaint has been made successfully.");
      setCategory("");
      setTitle("");
      setDescription("");
    } catch (error) {
      toast.error("Something went wrong while making complaints.");
    } finally {
      setDisable(false);
    }
  };

  return (
    <div className="mx-auto p-6 md:p-8 bg-white/80 rounded-2xl shadow-lg backdrop-blur-xl border">
      <h2 className="text-2xl font-bold text-gray-800">Make a Complaint</h2>
      <p className="text-sm mb-6">Please provide clear details of the issue.</p>

      <form onSubmit={handleSubmit}>
        <div className="mb-4 space-y-1">
          <Label htmlFor="title">Complaint Title</Label>
          <Input
            id="title"
            placeholder="Enter a short title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="mb-4 space-y-1">
          <Label htmlFor="category">Category</Label>
          <Select
            value={category}
            onValueChange={(val) => setCategory(val)}
            required
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a Category" />
            </SelectTrigger>
            <SelectContent>
              {categories &&
                categories?.map((cat) => (
                  <SelectItem
                    key={cat.complaint_cat_id}
                    value={cat.complaint_cat_id.toString()}
                  >
                    {cat.complaint_cat_name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

        <div className="mb-4 space-y-1">
          <Label htmlFor="description">Details</Label>
          <Textarea
            id="description"
            placeholder="Describe the issue in detail"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            required
          />
        </div>

        <div className="d-block overflow-hidden">
          <Button type="submit" className="float-right" disabled={disable}>
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
}
