
import { useFieldArray, useFormContext } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export const Step2DailyTasks = () => {
  const { control, watch } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "tasks",
  });
  
  const duration = watch("duration_days") || 30;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h3 className="text-lg font-medium">每日任務</h3>
        <p className="text-sm text-muted-foreground">
          定義挑戰期間每一天的具體任務。您可以稍後再回來編輯。
        </p>
      </div>
      <div className="space-y-4">
        {fields.map((field, index) => (
          <Card key={field.id} className="relative">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <p className="font-semibold">第 {watch(`tasks.${index}.day_number`) || index + 1} 天</p>
                <Button variant="ghost" size="icon" type="button" onClick={() => remove(index)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={control}
                name={`tasks.${index}.day_number`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>天數</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" max={duration} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name={`tasks.${index}.title`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>任務標題</FormLabel>
                    <FormControl>
                      <Input placeholder="例如：完成第一個 React 組件" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={control}
                name={`tasks.${index}.description`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>詳細說明 (可選)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="描述今天的任務細節..." {...field} />
                    </FormControl>
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
        onClick={() => append({ day_number: fields.length + 1, title: "", description: "" })}
      >
        新增一天任務
      </Button>
    </div>
  );
};
