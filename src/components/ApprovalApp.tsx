import React, { useState, useEffect } from 'react';
import { ArrowUpDown, Check, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { SearchableSelect } from './SearchableSelect';
import { ClassificationRow, generateDummyData, categoryOptions } from '../utils/dummyData';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { useToast } from '../hooks/use-toast';

type SortField = 'score_1' | 'score_2' | null;

export const ApprovalApp: React.FC = () => {
  const [data, setData] = useState<ClassificationRow[]>([]);
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const { toast } = useToast();

  useEffect(() => {
    const dummyData = generateDummyData();
    setData(dummyData);
  }, []);

  const unapprovedRows = data.filter(row => row.is_approved === 0);

  const sortedRows = [...unapprovedRows].sort((a, b) => {
    if (!sortField) return 0;
    
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (sortDirection === 'asc') {
      return aValue - bValue;
    } else {
      return bValue - aValue;
    }
  });

  const handleSort = (field: 'score_1' | 'score_2') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleCategory1Change = (rowId: number, newCategory1: string) => {
    setData(prevData => 
      prevData.map(row => {
        if (row.id === rowId) {
          // When category_1 changes, reset category_2 to first valid option
          const newCategory2 = categoryOptions.category_2[newCategory1 as keyof typeof categoryOptions.category_2][0].value;
          return {
            ...row,
            category_1: newCategory1,
            category_2: newCategory2,
            score_2: 100 // Score becomes 100 when manually changed
          };
        }
        return row;
      })
    );
  };

  const handleCategory2Change = (rowId: number, newCategory2: string) => {
    setData(prevData => 
      prevData.map(row => {
        if (row.id === rowId) {
          return {
            ...row,
            category_2: newCategory2,
            score_2: 100 // Score becomes 100 when manually changed
          };
        }
        return row;
      })
    );
  };

  const canApprove = () => {
    return unapprovedRows.length > 0 && unapprovedRows.every(row => row.score_1 !== 0 && row.score_2 !== 0);
  };

  const handleApprove = () => {
    if (!canApprove()) {
      toast({
        title: "Cannot Approve",
        description: "Please ensure all scores are greater than 0 before approving.",
        variant: "destructive"
      });
      return;
    }

    setData(prevData => 
      prevData.map(row => {
        if (row.is_approved === 0) {
          return { ...row, is_approved: 1 };
        }
        return row;
      })
    );

    toast({
      title: "Success",
      description: `Successfully approved ${unapprovedRows.length} classifications.`,
      variant: "default"
    });
  };

  const getScoreBadgeVariant = (score: number) => {
    if (score === 0) return "destructive";
    if (score < 50) return "secondary";
    if (score < 80) return "default";
    return "default";
  };

  const getCategory2Options = (category1: string) => {
    return categoryOptions.category_2[category1 as keyof typeof categoryOptions.category_2] || [];
  };

  // Pagination logic
  const totalPages = Math.ceil(sortedRows.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedRows = sortedRows.slice(startIndex, endIndex);

  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-foreground">
              Email Classification Approval
            </CardTitle>
            <div className="flex items-center gap-4 mt-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Pending Approvals:</span>
                <Badge variant="secondary" className="text-sm">
                  {unapprovedRows.length}
                </Badge>
              </div>
              {unapprovedRows.some(row => row.score_1 === 0 || row.score_2 === 0) && (
                <div className="flex items-center gap-2 text-warning">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm">Some scores are 0 - approval blocked</span>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => handleSort('score_1')}
                className="flex items-center gap-2"
              >
                <ArrowUpDown className="h-4 w-4" />
                Sort Score 1
                {sortField === 'score_1' && (
                  <span className="text-xs">({sortDirection})</span>
                )}
              </Button>
              
              <Button
                variant="outline"
                onClick={() => handleSort('score_2')}
                className="flex items-center gap-2"
              >
                <ArrowUpDown className="h-4 w-4" />
                Sort Score 2
                {sortField === 'score_2' && (
                  <span className="text-xs">({sortDirection})</span>
                )}
              </Button>
              
              <Button
                onClick={handleApprove}
                disabled={!canApprove()}
                className="flex items-center gap-2 ml-auto"
                variant={canApprove() ? "default" : "secondary"}
              >
                <Check className="h-4 w-4" />
                Approve All ({unapprovedRows.length})
              </Button>
            </div>
          </CardContent>
        </Card>

        {unapprovedRows.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Check className="h-12 w-12 text-success mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">All Classifications Approved</h3>
              <p className="text-muted-foreground">There are no pending classifications to review.</p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <th className="text-left p-4 font-medium text-sm text-muted-foreground uppercase tracking-wide min-w-[300px]">
                        Subject
                      </th>
                      <th className="text-left p-4 font-medium text-sm text-muted-foreground uppercase tracking-wide min-w-[180px]">
                        Category 1
                      </th>
                      <th className="text-left p-4 font-medium text-sm text-muted-foreground uppercase tracking-wide">
                        Score 1
                      </th>
                      <th className="text-left p-4 font-medium text-sm text-muted-foreground uppercase tracking-wide min-w-[180px]">
                        Category 2
                      </th>
                      <th className="text-left p-4 font-medium text-sm text-muted-foreground uppercase tracking-wide">
                        Score 2
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedRows.map((row, index) => (
                      <tr 
                        key={row.id} 
                        className={`border-b border-border hover:bg-muted/30 transition-colors ${
                          index % 2 === 0 ? 'bg-background' : 'bg-muted/10'
                        }`}
                      >
                        {/* Subject */}
                        <td className="p-4">
                          <p className="text-sm font-medium text-foreground line-clamp-2 max-w-[300px]">
                            {row.subject}
                          </p>
                        </td>

                        {/* Category 1 */}
                        <td className="p-4">
                          <SearchableSelect
                            options={categoryOptions.category_1}
                            value={row.category_1}
                            onChange={(value) => handleCategory1Change(row.id, value)}
                            className="min-w-[160px]"
                          />
                        </td>

                        {/* Score 1 */}
                        <td className="p-4">
                          <Badge variant={getScoreBadgeVariant(row.score_1)} className="text-xs font-mono">
                            {row.score_1}
                          </Badge>
                        </td>

                        {/* Category 2 */}
                        <td className="p-4">
                          <SearchableSelect
                            options={getCategory2Options(row.category_1)}
                            value={row.category_2}
                            onChange={(value) => handleCategory2Change(row.id, value)}
                            className="min-w-[160px]"
                          />
                        </td>

                        {/* Score 2 */}
                        <td className="p-4">
                          <Badge variant={getScoreBadgeVariant(row.score_2)} className="text-xs font-mono">
                            {row.score_2}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-4 py-3 border-t border-border">
                  <div className="text-sm text-muted-foreground">
                    Showing {startIndex + 1} to {Math.min(endIndex, sortedRows.length)} of {sortedRows.length} results
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handlePreviousPage}
                      disabled={currentPage === 1}
                      className="flex items-center gap-1"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </Button>
                    <span className="text-sm text-muted-foreground">
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages}
                      className="flex items-center gap-1"
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};