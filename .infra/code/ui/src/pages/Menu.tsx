import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Edit3, X, Search, DollarSign, Package, Tag, FileText, Loader2, AlertCircle, Plus } from 'lucide-react';
import { apiUrl } from "@/lib/utils";
import { getAccessToken, removeAccessToken } from "@/components/auth/tokenService";
import { useNavigate } from "react-router-dom";

const Menu: React.FC = () => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<any | null>(null);
  const [edit, setEdit] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddMode, setIsAddMode] = useState(false);
  const navigate = useNavigate();

  const fetchMenuItemsWithAuth = async () => {
    try {
      const token = await getAccessToken();
      const apiCall = await fetch(
        `${apiUrl}/list/items`,
        {
          method: 'POST',
          body: JSON.stringify({ token })
        }
      );
      if (apiCall.status === 403) {
        removeAccessToken();
        navigate('/login', { replace: true });
        return [];
      }
        if (apiCall.status === 400) {
            alert("Bad request. Please try again later.");
        }

      if (!apiCall.ok) {
        throw new Error('Network response was not ok');
      }
      const { response } = await apiCall.json();
      return response;
    } catch (error) {
      console.error('Error fetching menu items:', error);
      return [];
    }
  };

  const saveMenuItemWithAuth = async (item: any) => {
    try {
      const token = await getAccessToken();
      const apiCall = await fetch(
        `${apiUrl}/save/item`,
        {
          method: 'POST',
          body: JSON.stringify({ ...item, token })
        }
      );
      if (apiCall.status === 403) {
        removeAccessToken();
        navigate('/login', { replace: true });
        return { success: false, error: 'Unauthorized' };
      }

        if (apiCall.status === 400) {
            alert("Bad request. Please try again later.");
        }      
      if (!apiCall.ok) {
        throw new Error('Network response was not ok');
      }
      const { response } = await apiCall.json();
      return { success: true, item: response };
    } catch (error) {
      console.error('Error saving menu item:', error);
      return { success: false, error };
    }
  };

  useEffect(() => {
    fetchMenuItemsWithAuth().then((data) => {
      setItems(data);
      setLoading(false);
    });
  }, []);

  const filteredItems = items.filter(item =>
    item.item?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.subCategory?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRowClick = (item: any) => {
    setSelected(item);
    setEdit({ ...item });
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEdit({ ...edit, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setSaving(true);
    const res = await saveMenuItemWithAuth(edit);
    if (res.success) {
      if (isAddMode) {
        // Generate a new ID and hashKey for new items
        const newItem = {
          ...edit,
          id: Math.max(...items.map(i => i.id), 0) + 1,
          hashKey: `item_${Date.now()}`
        };
        setItems((prev) => [...prev, newItem]);
      } else {
        setItems((prev) => prev.map((i) => (i.id === edit.id ? edit : i)));
      }
      setSelected(null);
      setEdit(null);
      setIsAddMode(false);
    }
    setSaving(false);
  };

  const handleAddItem = () => {
    const newItem = {
      id: null,
      hashKey: undefined,
      item: '',
      category: '',
      subCategory: '',
      price: '',
      description: ''
    };
    setSelected(newItem);
    setEdit(newItem);
    setIsAddMode(true);
  };

  const handleCancel = () => {
    setSelected(null);
    setEdit(null);
    setIsAddMode(false);
  };

  if (typeof items === "undefined") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="h-12 w-12 text-slate-400 mb-4" />
            <p className="text-slate-600 text-center">No menu items found.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Menu Management</h1>
              <p className="text-slate-600 mt-1 text-sm sm:text-base">Manage your restaurant menu items</p>
            </div>
            <Button
              onClick={handleAddItem}
              className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 w-full sm:w-auto"
            >
              <Plus className="h-4 w-4" />
              Add New Item
            </Button>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input
              placeholder="Search menu items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full bg-white border-slate-200 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Main Content */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="border-b border-slate-100 bg-white/50">
            <CardTitle className="text-xl text-slate-800">
              Menu Items ({filteredItems.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-6 space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <Skeleton className="h-12 w-12 rounded-lg" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-[250px]" />
                      <Skeleton className="h-4 w-[200px]" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16">
                <Package className="h-16 w-16 text-slate-300 mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">No items found</h3>
                <p className="text-slate-500 text-center max-w-sm">
                  {searchTerm ? "Try adjusting your search terms" : "No menu items available"}
                </p>
              </div>
            ) : (
              <div className="overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-100 bg-slate-50/50">
                        <th className="text-left py-3 px-3 sm:py-4 sm:px-6 font-semibold text-slate-700 text-xs sm:text-sm">
                          <div className="flex items-center gap-1 sm:gap-2">
                            <Package className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span className="hidden sm:inline">Item</span>
                          </div>
                        </th>
                        <th className="text-left py-3 px-3 sm:py-4 sm:px-6 font-semibold text-slate-700 text-xs sm:text-sm">
                          <div className="flex items-center gap-1 sm:gap-2">
                            <Tag className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span className="hidden sm:inline">Category</span>
                          </div>
                        </th>
                        <th className="text-left py-3 px-3 sm:py-4 sm:px-6 font-semibold text-slate-700 text-xs sm:text-sm hidden md:table-cell">
                          Sub Category
                        </th>
                        <th className="text-left py-3 px-3 sm:py-4 sm:px-6 font-semibold text-slate-700 text-xs sm:text-sm">
                          <div className="flex items-center gap-1 sm:gap-2">
                            <DollarSign className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span className="hidden sm:inline">Price</span>
                          </div>
                        </th>
                        <th className="text-left py-3 px-3 sm:py-4 sm:px-6 font-semibold text-slate-700 text-xs sm:text-sm hidden lg:table-cell">
                          <div className="flex items-center gap-1 sm:gap-2">
                            <FileText className="h-3 w-3 sm:h-4 sm:w-4" />
                            Description
                          </div>
                        </th>
                        <th className="w-8 sm:w-12 py-3 px-3 sm:py-4 sm:px-6"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredItems.map((item) => (
                        <tr
                          key={`listed_${item.hashKey}`}
                          className="border-b border-slate-50 hover:bg-blue-50/50 transition-all duration-200 cursor-pointer group"
                          onClick={() => handleRowClick(item)}
                        >
                          <td className="py-3 px-3 sm:py-4 sm:px-6">
                            <div className="font-semibold text-slate-900 group-hover:text-blue-700 transition-colors text-xs sm:text-sm">
                              {item.item}
                            </div>
                          </td>
                          <td className="py-3 px-3 sm:py-4 sm:px-6">
                            <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-200 text-xs">
                              {item.category}
                            </Badge>
                          </td>
                          <td className="py-3 px-3 sm:py-4 sm:px-6 hidden md:table-cell">
                            <span className="text-slate-600 text-xs sm:text-sm">
                              {item.subCategory}
                            </span>
                          </td>
                          <td className="py-3 px-3 sm:py-4 sm:px-6">
                            <span className="font-semibold text-green-700 bg-green-50 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-md text-xs">
                              ₦{item.price?.toLocaleString()}
                            </span>
                          </td>
                          <td className="py-3 px-3 sm:py-4 sm:px-6 hidden lg:table-cell">
                            <span className="text-slate-600 text-xs sm:text-sm line-clamp-2">
                              {item.description}
                            </span>
                          </td>
                          <td className="py-3 px-3 sm:py-4 sm:px-6">
                            <Edit3 className="h-3 w-3 sm:h-4 sm:w-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-100">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                  {isAddMode ? 'Add New Item' : 'Edit Menu Item'}
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  {isAddMode ? 'Create a new menu item' : 'Update item details'}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCancel}
                className="h-8 w-8 p-0 hover:bg-slate-100 rounded-full"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Modal Content */}
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Item Name
                </label>
                <Input
                  name="item"
                  value={edit.item}
                  onChange={handleEditChange}
                  placeholder="Enter item name"
                  className="border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                    <Tag className="h-4 w-4" />
                    Category
                  </label>
                  <Input
                    name="category"
                    value={edit.category}
                    onChange={handleEditChange}
                    placeholder="Category"
                    className="border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">
                    Sub Category
                  </label>
                  <Input
                    name="subCategory"
                    value={edit.subCategory}
                    onChange={handleEditChange}
                    placeholder="Sub category"
                    className="border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Price (₦)
                </label>
                <Input
                  name="price"
                  value={edit.price}
                  onChange={handleEditChange}
                  placeholder="0.00"
                  type="number"
                  step="0.01"
                  className="border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Description
                </label>
                <Input
                  name="description"
                  value={edit.description}
                  onChange={handleEditChange}
                  placeholder="Item description"
                  className="border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 p-4 sm:p-6 border-t border-slate-100 bg-slate-50/50">
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={saving}
                className="border-slate-200 hover:bg-slate-50 w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-700 text-white min-w-[80px] w-full sm:w-auto"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    {isAddMode ? 'Adding...' : 'Saving...'}
                  </>
                ) : (
                  isAddMode ? 'Add Item' : 'Save Changes'
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Menu;
