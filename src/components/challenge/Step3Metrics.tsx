
import { useFieldArray, useFormContext } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export const Step3Metrics = () => {
  const { control, watch } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "metrics",
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h3 className="text-lg font-medium">追蹤指標</h3>
        <p className="text-sm text-muted-foreground">
          設定您希望參與者追蹤的數據指標。
        </p>
      </div>
      <div className="space-y-4">
        {fields.map((field, index) => (
          <Card key={field.id} className="relative">
             <CardHeader className="flex flex-row items-center justify-between pb-2">
                <p className="font-semibold">{watch(`metrics.${index}.metric_name`) || `指標 ${index + 1}`}</p>
                <Button variant="ghost" size="icon" type="button" onClick={() => remove(index)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={control}
                name={`metrics.${index}.metric_name`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>指標名稱</FormLabel>
                    <FormControl>
                      <Input placeholder="例如：完成的組件數量" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name={`metrics.${index}.metric_type`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>指標類型</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="選擇一個類型" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="numeric">數字</SelectItem>
                        <SelectItem value="text">文字</SelectItem>
                        <SelectItem value="boolean">是/否</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        ))}
      </div>
      <Button
        type="button"
        variant="outline"
        onClick={() => append({ metric_name: "", metric_type: "numeric" })}
      >
        新增指標
      </Button>
    </div>
  );
};
