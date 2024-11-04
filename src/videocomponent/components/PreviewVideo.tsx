import React, { useEffect, useState } from "react";
import Editor from "./video-editor/Editor";
import { IoMdClose } from "react-icons/io";
import { PreviewVideoProps } from "../utils/types";
import axios from "axios";
import { useForm } from "react-hook-form";
import Spinner from "../utils/spinner";

const API_URL = "http://localhost:5001/api";

const PreviewVideo = ({
    dataUrl,
    handleClose,
}: PreviewVideoProps) => {
    const [loading, setLoading] = useState(true);
    const [updatedDataUrl, setUpdatedDataUrl] = useState("");
    const [editing, setEditing] = useState(false);
    const [workspaces, setWorkspaces] = useState([]);
    const [projects, setProjects] = useState([]);
    const [token, setToken] = useState("");
    const [activeWorkspace, setActiveWorkspace] = useState("");
    const [includeFullscreen, setIncludeFullscreen] = useState(false);


    const {
        register,
        handleSubmit,
        getValues,
        formState: { errors },
        watch
    } = useForm({
        defaultValues: {
            title: "",
            description: "",
            workspace: "",
            project: ""
        }
    });

    const onSubmit = (data: any) => {
        let obj = {
            title: data.title,
            description: data.description,
            project: data.project,
            dataUrl: updatedDataUrl,
        }
    };

    useEffect(() => {
        if (activeWorkspace) {
            getProjects(activeWorkspace);
        }
    }, [activeWorkspace])


    const handleSave = (dataUrl: string) => {
        setUpdatedDataUrl(dataUrl);
    };

    const getUserWorkspace = (token: string) => {
        axios.get(API_URL + `/user/workspaces`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }).then((response) => {
            setWorkspaces(response.data);
            console.log("workspace", response.data);
        }).catch((error) => {
            console.log(error);
        })
    }

    const getProjects = (workspaceId: string) => {
        axios.get(API_URL + `/workspaces/${workspaceId}/projects`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }).then((response) => {
            setProjects(response.data);
            console.log("projects", response.data);
        }).catch((error) => {
            console.log(error);
        })
    }

    useEffect(() => {
        setLoading(false);
    }, [dataUrl]);

    if (loading) {
        return (
            <div className="h-screen w-screen bg-black/5 flex flex-col items-center justify-center">
                <Spinner loading={loading} height={50} width={50} color="#fd6262" />
            </div>
        )
    }



    return (
        <div className="h-screen w-screen bg-black/5 flex flex-col items-center justify-center">
            <div className="w-[85vw] h-[85vh] relative flex flex-col items-start rounded-xl shadow-lg bg-white ">
                <div className="w-full h-[5vh] flex flex-row items-center border-b-[1px] border-gray-300 justify-between px-4">
                    <p className=" text-red-500 text-2xl font-bold">Create Flag</p>

                    <button onClick={handleClose}>
                        <IoMdClose className=" text-xl" />
                    </button>
                </div>
                <div className=" w-full flex flex-row justify-between items-center h-[80vh]">
                    <div className=" flex flex-col items-center justify-center h-full w-8/12 border-r-[1px] border-gray-300">
                        <div className=" h-[80vh] w-full flex flex-col items-center justify-center border-b-[1px] border-gray-300">
                            {dataUrl.length > 0 ? (
                                <Editor
                                    dataUrl={dataUrl}
                                    onSave={handleSave}
                                />
                            ) : null}
                        </div>
                    </div>
                    <div className=" flex flex-col items-center justify-center h-full w-4/12 py-4">
                        {
                            !loading ?
                                <form
                                    onSubmit={handleSubmit(onSubmit)}
                                    className=" w-full h-full flex flex-col items-center justify-start mt-4 px-4"
                                >
                                    <div className=" flex flex-col items-start w-full">
                                        <label
                                            className=" text-red-500 text-lg font-semibold"
                                        >
                                            Title
                                        </label>
                                        <input
                                            id="title"
                                            type="text"
                                            {...register("title", { required: true })}
                                            className=" w-full rounded-lg text-lg py-1 border-[1px] border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 px-3"
                                            placeholder="Enter title"
                                        />
                                        {
                                            errors.title && (
                                                <p className=" text-red-500 text-xs font-semibold">
                                                    {errors.title.message}
                                                </p>
                                            )
                                        }
                                    </div>

                                    <div className=" flex flex-col items-start w-full mt-4">
                                        <label

                                            className=" text-red-500 text-lg font-semibold"
                                        >
                                            Description
                                        </label>
                                        <textarea
                                            id="description"
                                            {...register("description", { required: true })}
                                            className=" w-full h-[10vh] text-lg py-1 rounded-lg border-[1px] border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 px-3"
                                            placeholder="Enter description"
                                        />
                                        {
                                            errors.description && (
                                                <p className=" text-red-500 text-xs font-semibold">
                                                    {errors.description.message}
                                                </p>
                                            )
                                        }
                                    </div>

                                    <div className=" flex flex-col items-start w-full mt-4">
                                        <label

                                            className=" text-red-500 text-lg font-semibold"
                                        >
                                            Workspace
                                        </label>
                                        <select
                                            id="workspace"
                                            {...register("workspace", { required: true })}
                                            onChange={(e) => setActiveWorkspace(e.target.value)}
                                            className=" w-full rounded-lg text-lg py-1 border-[1px] border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 px-3"
                                        >
                                            <option selected disabled value="">Select Workspace</option>
                                            {
                                                workspaces.map((item: any, index) => {
                                                    return (
                                                        <option key={index} value={item.id}>{item.name}</option>
                                                    )
                                                })
                                            }
                                        </select>
                                        {
                                            errors.workspace && (
                                                <p className=" text-red-500 text-xs font-semibold">
                                                    {errors.workspace.message}
                                                </p>
                                            )
                                        }
                                    </div>

                                    <div className=" flex flex-col items-start w-full mt-4">
                                        <label
                                            className=" text-red-500 text-lg font-semibold"
                                        >
                                            Project
                                        </label>
                                        <select
                                            id="project"
                                            {...register("project", { required: true })}
                                            className=" w-full rounded-lg text-lg py-1 border-[1px] border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 px-3"
                                        >
                                            <option selected disabled value="">Select project</option>
                                            {
                                                projects.map((item: any, index) => {
                                                    return (
                                                        <option key={index} value={item.id}>{item.name}</option>
                                                    )
                                                })
                                            }
                                        </select>
                                        {
                                            errors.project && (
                                                <p className=" text-red-500 text-xs font-semibold">
                                                    {errors.project.message}
                                                </p>
                                            )
                                        }
                                    </div>

                                    <button

                                        type="submit"
                                        className=" w-full py-2 rounded-lg border-[1px]  bg-red-500 text-white border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 px-3 mt-4"
                                    >
                                        Save
                                    </button>

                                </form> :
                                <div className=" w-full h-full flex flex-col items-center justify-center">
                                    <Spinner loading={loading} width={12} height={24} color="#fd6262" />
                                </div>
                        }

                    </div>
                </div>
            </div>
        </div>
    );
};

export default PreviewVideo;
