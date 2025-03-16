
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

const fieldSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Field name is required"),
  label: z.string().min(1, "Label is required"),
  type: z.enum(["text", "email", "phone", "textarea"]),
  required: z.boolean().default(false),
});

const formSchema = z.object({
  enabled: z.boolean().default(true),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  fields: z.array(fieldSchema).min(1, "At least one field is required"),
  buttonText: z.string().min(1, "Button text is required"),
  successMessage: z.string().min(1, "Success message is required"),
});

type FormValues = z.infer<typeof formSchema>;

interface LeadFormStepProps {
  onNext: (data: FormValues) => void;
  onBack: () => void;
  initialData?: FormValues;
}

const LeadFormStep = ({ onNext, onBack, initialData }: LeadFormStepProps) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      enabled: true,
      title: "Get in Touch",
      description: "Please fill out this form and we'll get back to you shortly.",
      fields: [
        { id: "name", name: "name", label: "Full Name", type: "text", required: true },
        { id: "email", name: "email", label: "Email Address", type: "email", required: true },
        { id: "phone", name: "phone", label: "Phone Number", type: "phone", required: false },
      ],
      buttonText: "Submit",
      successMessage: "Thanks for reaching out! We'll be in touch soon.",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "fields",
  });

  const addField = () => {
    append({
      id: crypto.randomUUID(),
      name: "",
      label: "",
      type: "text",
      required: false,
    });
  };

  const handleSubmit = (data: FormValues) => {
    onNext(data);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Lead Form Configuration</CardTitle>
        <CardDescription>
          Set up a lead capture form to collect visitor information.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="enabled"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Enable Lead Form</FormLabel>
                    <FormDescription>
                      When enabled, users will be prompted to fill out this form during the conversation.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            {form.watch("enabled") && (
              <>
                <div className="grid grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Form Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Get in Touch" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="buttonText"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Submit Button Text</FormLabel>
                        <FormControl>
                          <Input placeholder="Submit" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Form Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Please fill out this form and we'll get back to you shortly."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="successMessage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Success Message</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Thanks for reaching out! We'll be in touch soon."
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Message shown after successful form submission.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div>
                  <div className="flex justify-between items-center mb-4">
                    <FormLabel className="text-base">Form Fields</FormLabel>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addField}
                      className="flex items-center gap-1"
                    >
                      <Plus className="h-4 w-4" /> Add Field
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {fields.map((field, index) => (
                      <div
                        key={field.id}
                        className="flex gap-4 items-start p-4 rounded-md border"
                      >
                        <div className="grid grid-cols-2 gap-4 flex-1">
                          <FormField
                            control={form.control}
                            name={`fields.${index}.label`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Label</FormLabel>
                                <FormControl>
                                  <Input placeholder="Full Name" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`fields.${index}.name`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Field Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="name" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`fields.${index}.type`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Type</FormLabel>
                                <FormControl>
                                  <select
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={field.value}
                                    onChange={field.onChange}
                                  >
                                    <option value="text">Text</option>
                                    <option value="email">Email</option>
                                    <option value="phone">Phone</option>
                                    <option value="textarea">Text Area</option>
                                  </select>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`fields.${index}.required`}
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0 pt-6">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel>Required field</FormLabel>
                                </div>
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => remove(index)}
                          className="mt-6"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            <div className="flex justify-between mt-8">
              <Button type="button" variant="outline" onClick={onBack}>
                Back
              </Button>
              <Button type="submit">Next: Summary</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default LeadFormStep;
