import { Box, IconButton, useTheme } from '@mui/material'
import React, { useContext } from 'react'
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import { colorModeContext, tokens } from '@/app/utils/ThemeAdmin';
import DropdownNotifications from './DropdownNotification';

const Topbar = () => {
    const theme = useTheme()
    const colorMode = useContext(colorModeContext);

    return (
        <>
            <div className='flex justify-end pt-2 px-2'>
                <Box 
                display='flex' 
                sx={{ justifyContent: 'space-between', alignItems: 'center'}}>
                    <IconButton onClick={colorMode.toggleColorMode}>
                        {theme.palette.mode === 'dark' ? (
                            <DarkModeOutlinedIcon/>
                            ) : (
                            <LightModeOutlinedIcon/>
                        )}
                    </IconButton>
                    <IconButton><DropdownNotifications align="right"/></IconButton>
                </Box>
            </div>
        </>
    )
}

export default Topbar