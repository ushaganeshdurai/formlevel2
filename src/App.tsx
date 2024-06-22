import { z } from "zod";
import * as React from 'react';
import { SelectChangeEvent } from "@mui/material";
import dayjs, { Dayjs } from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

import { Select, MenuItem, Modal, Box, Typography, Button } from '@mui/material';

import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import './index.css';

const RegistrationSchema = z.object({
  email: z.string().email({ message: "Invalid email format" }),
  name: z.string().min(3, { message: "Enter at least 3 characters" }).max(20, { message: "Too long" }),
  phno: z.string().min(10, { message: "Enter 10 digits" }).max(10, { message: "Enter 10 digits" }),
  url: z.string().url({ message: "Invalid URL" }).optional(),
  exp: z.number().positive({ message: "Must be greater than 0" }).optional(),
  manExp: z.string().min(1).optional(),
  skills: z.object({
    Java: z.boolean(),
    Python: z.boolean(),
    JavaScript: z.boolean(),
    CSS: z.boolean(),
  }).refine(data => Object.values(data).some(skill => skill === true), {
    message: "Select at least one skill",
    path: ["skills"]
  }),
  datetime: z.date({ required_error: "Preferred interview time is required" }).optional(),
});

type RegistrationSchemaType = z.infer<typeof RegistrationSchema>;

export default function App() {
  const [dateValue, setDateValue] = React.useState<Dayjs | null>(dayjs());
  const [position, setPosition] = React.useState<string>("Developer");
  const [open, setOpen] = React.useState(false);
  const [submittedData, setSubmittedData] = React.useState<RegistrationSchemaType | null>(null);

  const { register, handleSubmit, formState: { errors }, setValue: setFormValue } = useForm<RegistrationSchemaType>({
    resolver: zodResolver(RegistrationSchema)
  });

  const onSubmit: SubmitHandler<RegistrationSchemaType> = (data) => {
    data.datetime = dateValue?.toDate();
    setSubmittedData(data);
    setOpen(true);
  };

  const handlePositionChange = (event: SelectChangeEvent<string >) => {
    setPosition(event.target.value as string);
  };

  const handleClose = () => setOpen(false);

  React.useEffect(() => {
    setFormValue("datetime", dateValue?.toDate());
  }, [dateValue, setFormValue]);

  return (
    <div className="container">
      <form onSubmit={handleSubmit(onSubmit)} className="form bg-white items-center justify-center rounded p-4">
        <div className="mb-5">
          <label htmlFor="name" className="text-sm font-medium text-black">Your full name</label>
          <input type="text" id="name" {...register("name")} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Your full name" required />
          {errors.name && <span className="text-[#ff0000]">{errors.name.message}</span>}
        </div>
        <div className="mb-5">
          <label htmlFor="email" className="text-sm font-medium text-black">Your email</label>
          <input type="email" id="email" {...register("email")} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="name@gmail.com" required />
          {errors.email && <span className="text-[#ff0000]">{errors.email.message}</span>}
        </div>
        <div className="mb-5">
          <label htmlFor="phno" className="text-sm font-medium text-black">Your Phone Number</label>
          <input type="text" id="phno" {...register("phno")} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Your phone number" required />
          {errors.phno && <span className="text-[#ff0000]">{errors.phno.message}</span>}
        </div>
        <div className="mb-5">
          <label htmlFor="position" className="text-sm font-medium text-black">Applying for position</label> <br />
          <Select className="bg-white text-black" value={position} onChange={handlePositionChange} id="position" name="position">
            <MenuItem className="bg-white p-3 text-black" value="Developer">Developer</MenuItem>
            <MenuItem className="bg-white p-3 text-black" value="Manager">Manager</MenuItem>
            <MenuItem className="bg-white p-3 text-black" value="Designer">Designer</MenuItem>
          </Select>
        </div>
        {position === 'Developer' || position === 'Designer' ? (
          <div className="mb-5">
            <label htmlFor="exp" className="text-sm font-medium text-black">Relevant Experience (years)</label>
            <input type="number" min={1} id="exp" {...register("exp", { valueAsNumber: true })} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Years of experience" required />
            {errors.exp && <span className="text-[#ff0000]">{errors.exp.message}</span>}
          </div>
        ) : null}
        {position === 'Designer' ? (
          <div className="mb-5">
            <label htmlFor="url" className="text-sm font-medium text-black">Portfolio URL</label>
            <input type="text" id="url" {...register("url")} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Portfolio URL" required />
            {errors.url && <span className="text-[#ff0000]">{errors.url.message}</span>}
          </div>
        ) : null}
        {position === 'Manager' ? (
          <div className="mb-5">
            <label htmlFor="manExp" className="text-sm font-medium text-black">Management Experience</label>
            <input type="text" id="manExp" {...register("manExp")} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Management experience" required />
            {errors.manExp && <span>{errors.manExp.message}</span>}
          </div>
        ) : null}
        <div className="mb-5">
          <label className="text-sm font-medium text-black">Additional Skills</label> <br />
          <input type="checkbox" {...register("skills.Java")} id="Java" className="mr-1" /> <label htmlFor="Java" className="text-black">Java</label> <br />
          <input type="checkbox" {...register("skills.Python")} id="Python" className="mr-1" /> <label htmlFor="Python" className="text-black">Python</label> <br />
          <input type="checkbox" {...register("skills.JavaScript")} id="JavaScript" className="mr-1" /> <label htmlFor="JavaScript" className="text-black">JavaScript</label> <br />
          <input type="checkbox" {...register("skills.CSS")} id="CSS" className="mr-1" /> <label htmlFor="CSS" className="text-black">CSS</label> <br />
          {errors.skills && <span>{errors.skills.message}</span>}
        </div>
        <div className="mb-5">
          <label htmlFor="datetime" className="text-sm font-medium text-black">Preferred Interview Time</label>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={['DateTimePicker']}>
              <DateTimePicker
                value={dateValue}
                onChange={(newValue) => setDateValue(newValue)}
              />
            </DemoContainer>
          </LocalizationProvider>
          {errors.datetime && <span>{errors.datetime.message}</span>}
        </div>

        <button type="submit" className="text-white bg-gray-700 font-medium rounded-lg text-sm px-5 py-2.5">SUBMIT</button>
      </form>

      <Modal open={open} onClose={handleClose}>
        <Box className="modal-box">
          <Typography variant="h6" component="h2">Submitted Data</Typography>
          {submittedData && (
            <div>
              <Typography><strong>Name:</strong> {submittedData.name}</Typography>
              <Typography><strong>Email:</strong> {submittedData.email}</Typography>
              <Typography><strong>Phone Number:</strong> {submittedData.phno}</Typography>
              <Typography><strong>Position:</strong> {position}</Typography>
              {submittedData.exp !== undefined && <Typography><strong>Experience:</strong> {submittedData.exp} years</Typography>}
              {submittedData.url && <Typography><strong>Portfolio URL:</strong> {submittedData.url}</Typography>}
              {submittedData.manExp && <Typography><strong>Management Experience:</strong> {submittedData.manExp}</Typography>}
              <Typography><strong>Skills:</strong> {Object.keys(submittedData.skills).filter(skill => submittedData.skills[skill as keyof typeof submittedData.skills]).join(', ')}</Typography>
              <Typography><strong>Preferred Interview Time:</strong> {submittedData.datetime ? dayjs(submittedData.datetime).format('MMMM D, YYYY h:mm A') : 'N/A'}</Typography>
            </div>
          )}
          <Button onClick={handleClose} className="text-white bg-gray-700 font-medium rounded-lg text-sm px-5 py-2.5 mt-4">Close</Button>
        </Box>
      </Modal>
    </div>
  );
}
