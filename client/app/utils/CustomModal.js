import React from "react";
import { Modal, Box } from "@mui/material";

const CustomModal = ({
    open,
    setOpen,
    activeItem,
    component: Component,
    setRoute,
}) => {
    return (
        <Modal
            open={open}
            onClose={() => setOpen(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box>
                <Component setOpen={setOpen} setRoute={setRoute} />
            </Box>
        </Modal>
    );
};

export default CustomModal;
