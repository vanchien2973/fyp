import React from "react";
import { Dialog, DialogContent } from "../components/ui/dialog";

const CustomModal = ({ open, setOpen, activeItem, component: Component, setRoute, refetch }) => {
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-[24rem] p-4 max-h-[90vh] overflow-y-auto">
                <Component setOpen={setOpen} setRoute={setRoute} refetch={refetch}/>
            </DialogContent>
        </Dialog>
    );
};

export default CustomModal;
