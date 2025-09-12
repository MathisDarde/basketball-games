"use client";

import deletePhotoDeProfil from "@/actions/user/delete-profile-pic";
import updateProfileForm from "@/actions/user/update-profile-form";
import { updateProfileSchema } from "@/app/schema";
import ActionPopup from "@/components/ActionPopup";
import { teams } from "@/components/Teams";
import { SelectUser } from "@/db/schema";
import { updateProfileSchemaType } from "@/types/forms";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImageIcon, Mail, Trash, User } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function UpdateProfileForm({
  userData,
}: {
  userData: SelectUser;
}) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewPhoto, setPreviewPhoto] = useState<string | null>(
    userData.profilepicture || "/_assets/img/pdpdebase.png"
  );
  const [openDeletePicPopup, setOpenDeletePicPopup] = useState(false);
  const router = useRouter();

  const { register, handleSubmit, setValue } = useForm<updateProfileSchemaType>(
    {
      resolver: zodResolver(updateProfileSchema),
      defaultValues: {
        name: userData.name,
        email: userData.email,
        favorite_team: userData.favorite_team || "",
        profilepicture: userData.profilepicture || "",
      },
    }
  );

  const handleSelect = (team: string) => {
    setValue("favorite_team", team);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
      setPreviewPhoto(URL.createObjectURL(event.target.files[0]));
    }
  };

  const handleDeletePDP = async () => {
    setSelectedFile(null);
    setPreviewPhoto("/pdpdebase.png");
    if (userData.id) {
      await deletePhotoDeProfil(userData.id);
    }
  };

  const handleSubmitForm = async (data: updateProfileSchemaType) => {
    console.log("Submit data:", data, selectedFile);

    if (!userData.id) {
      return;
    }

    const formData = new FormData();

    if (selectedFile) {
      formData.append("image", selectedFile);
    }

    Object.entries(data).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        formData.append(key, JSON.stringify(value));
      } else if (isDate(value)) {
        formData.append(key, value.toISOString());
      } else if (typeof value === "string") {
        formData.append(key, value);
      } else if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });

    function isDate(value: unknown): value is Date {
      return value instanceof Date && !isNaN(value.getTime());
    }

    const response = await updateProfileForm(
      userData.id,
      data,
      selectedFile ?? undefined
    );

    console.log("Update response:", response);

    if (response.success) {
      router.push("/profile");
    } else {
      return;
    }
  };

  return (
    <>
      {/* Delete profile picture Popup */}
      {openDeletePicPopup && (
        <ActionPopup
          onClose={() => setOpenDeletePicPopup(false)}
          title="Delete profile picture"
          description="Are you sure you want to delete your profile picture ? This action is irreversible and the picture will be lost."
          actions={[
            {
              label: "Discard",
              onClick: () => setOpenDeletePicPopup(false),
              theme: "discard",
            },
            {
              label: "Confirm",
              onClick: () => {
                handleDeletePDP();
                setOpenDeletePicPopup(false);
              },
              theme: "confirm",
            },
          ]}
        />
      )}

      <div className="w-screen xl:w-[600px] mx-auto px-8 pb-8 mt-4 text-center">
        <form
          className="w-full xl:w-[600px] space-y-2"
          onSubmit={handleSubmit(handleSubmitForm)}
        >
          <div className="relative w-full xl:w-[600px] space-y-2">
            {previewPhoto && (
              <div className="w-fit mb-4 relative mx-auto">
                <Image
                  width={256}
                  height={256}
                  src={previewPhoto || "/pdpdebase.png"}
                  alt="Profile picture"
                  className="w-40 h-40 rounded-full object-cover mr-4"
                />
                <button
                  type="button"
                  onClick={() => setOpenDeletePicPopup(true)}
                  className="absolute bg-red-700 hover:bg-red-800 text-white p-2 rounded-full bottom-4 right-3"
                  aria-label="Delete profile picture"
                >
                  <Trash size={20} />
                </button>
              </div>
            )}

            {/* input file caché */}
            <input
              type="file"
              id="fileInput"
              onChange={handleFileChange}
              className="hidden"
              accept="image/*"
            />
            <p className="font-outfit text-sm">
              Current profile picture,
              <label
                htmlFor="fileInput"
                className="font-outfit text-accent-brown underline cursor-pointer ml-1"
              >
                update ?
              </label>
            </p>
          </div>

          <div className="relative w-full xl:w-[600px] space-y-2">
            <span className="font-outfit text-black flex items-center">
              <User size={18} className="mr-2" />
              Name :
            </span>
            <input
              type="text"
              {...register("name")}
              className="w-full xl:w-[600px] py-3 px-4 rounded border border-accent-brown shadow font-outfit text-sm bg-white"
              placeholder="Name"
            />
          </div>

          <div className="relative w-full xl:w-[600px] space-y-2">
            <span className="font-outfit text-black flex items-center">
              <Mail size={18} className="mr-2" />
              Mail address :
            </span>
            <input
              type="email"
              {...register("email")}
              className="w-full xl:w-[600px] py-3 px-4 rounded border border-accent-brown shadow font-outfit text-sm bg-white"
              placeholder="Mail address"
            />
          </div>

          <div className="relative w-full xl:w-[600px] space-y-2">
            <span className="font-outfit text-black flex items-center">
              <ImageIcon size={18} className="mr-2" />
              Favorite Team :
            </span>
            <select
              {...register("favorite_team")}
              className="w-full xl:w-[600px] py-3 px-4 rounded border border-accent-brown shadow font-outfit text-sm bg-white"
              onChange={(e) => handleSelect(e.target.value)}
            >
              {[...teams]
                .sort((a, b) => a.localeCompare(b))
                .map((team, index) => (
                  <option key={index} value={team}>
                    {team}
                  </option>
                ))}
            </select>
          </div>

          <div className="inline-flex justify-center items-center rounded bg-accent-brown py-2 px-4 text-white font-outfit mt-4">
            <button type="submit">Update my informations</button>
          </div>
        </form>
      </div>
    </>
  );
}
