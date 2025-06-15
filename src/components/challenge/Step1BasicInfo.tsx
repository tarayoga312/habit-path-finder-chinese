
import { useFormContext } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export const Step1BasicInfo = () => {
  const { control } = useFormContext();

  return (
    <div className="space-y-8 animate-fade-in">
      <FormField
        control={control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>挑戰名稱</FormLabel>
            <FormControl>
              <Input placeholder="例如：三十天學習 React" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>挑戰描述</FormLabel>
            <FormControl>
              <Textarea placeholder="詳細描述您的挑戰內容、目標與規則..." className="min-h-[150px]" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
       <FormField
        control={control}
        name="duration_days"
        render={({ field }) => (
          <FormItem>
            <FormLabel>持續天數</FormLabel>
            <FormControl>
              <Input type="number" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="image_url"
        render={({ field }) => (
          <FormItem>
            <FormLabel>封面圖片網址 (可選)</FormLabel>
            <FormControl>
              <Input placeholder="https://example.com/image.png" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="challenge_type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>挑戰類型 (可選)</FormLabel>
            <FormControl>
              <Input placeholder="例如：健身、學習、生活習慣" {...field} />
            </FormControl>
             <FormDescription>為您的挑戰加上分類標籤。</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="start_date"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>開始日期 (可選)</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[240px] pl-3 text-left font-normal",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {field.value ? (
                      format(field.value, "PPP")
                    ) : (
                      <span>選擇一個日期</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={field.onChange}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <FormDescription>
              挑戰的預計開始日期。
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
