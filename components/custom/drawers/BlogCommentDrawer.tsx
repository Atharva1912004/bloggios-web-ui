import React, {useState} from 'react';
import {Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger} from "@/components/ui/sheet";
import {HiOutlineChatBubbleOvalLeftEllipsis} from "react-icons/hi2";
import BlogCommentField from "@/components/custom/blog/BlogCommentField";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Button as ShadButton} from "@/components/ui/button";
import {useSelector} from "react-redux";
import {RootState} from "@/state/store";
import CommentCard from "@/components/custom/blog/CommentCard";

const BlogCommentDrawer = ({data}: { data: any }) => {

    const [selectedCommentMode, setSelectedCommentMode] = useState("Relevant");
    const {isAuthenticated} = useSelector((state: RootState) => state.auth);

    return (
        <Sheet>
            <SheetTrigger asChild>
                <HiOutlineChatBubbleOvalLeftEllipsis className={"text-xl"}/>
            </SheetTrigger>
            <SheetContent side={"right"} className={"min-w-[440px] p-2 min-h-screen"} style={{
                overflowY: "auto",
                outline: "none",
            }}>
                <SheetHeader className={"p-4"}>
                    <SheetTitle className={"text-2xl"}>Discussions</SheetTitle>
                </SheetHeader>
                {isAuthenticated && <BlogCommentField/>}
                <SheetFooter>
                    <div className={"flex flex-col gap-4 w-full"}>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <ShadButton variant="outline" className={"flex gap-2 w-fit self-end"}>
                                    {selectedCommentMode}
                                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none"
                                         xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M3.13523 6.15803C3.3241 5.95657 3.64052 5.94637 3.84197 6.13523L7.5 9.56464L11.158 6.13523C11.3595 5.94637 11.6759 5.95657 11.8648 6.15803C12.0536 6.35949 12.0434 6.67591 11.842 6.86477L7.84197 10.6148C7.64964 10.7951 7.35036 10.7951 7.15803 10.6148L3.15803 6.86477C2.95657 6.67591 2.94637 6.35949 3.13523 6.15803Z"
                                            fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                                    </svg>
                                </ShadButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56">
                                <DropdownMenuCheckboxItem
                                    onClick={() => setSelectedCommentMode("Relevant")}
                                    checked={selectedCommentMode === "Relevant"}
                                >
                                    Relevant
                                </DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem
                                    onClick={()=> setSelectedCommentMode("Recent")}
                                    checked={selectedCommentMode === "Recent"}
                                >
                                    Recent
                                </DropdownMenuCheckboxItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <CommentCard />
                        <CommentCard />
                        <CommentCard />
                        <CommentCard />
                    </div>
                </SheetFooter>

            </SheetContent>
        </Sheet>
    );
};

export default BlogCommentDrawer;