import React, { useState, useEffect } from "react";
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';

import './endpoint.css';

export default function EndpointSetter() {
    const handleDropdownChange = (e) => {
        console.log(e.target.value)
        localStorage.setItem("endpoint", e.target.value)
        window.location.reload();
    }

    return (
      <Box sx={{ minWidth: 120, backgroundImage: "linear-gradient(144deg, #2f00ff, #5B42F3 50%, #00DDEB)", borderRadius:"10px", padding:"3px", marginTop:"1px"}}>
      <FormControl fullWidth>
            <Select
                shrink={false}
                defaultValue={localStorage.getItem("endpoint")}
                labelId="demo-simple-select-label"
                onChange={handleDropdownChange}
                inputProps={{
                  MenuProps: {
                      MenuListProps: {
                          sx: {
                            backgroundImage: "linear-gradient(-200deg, #010d1b, #061f31)",
                            color:'rgba(255, 255, 255, 0.73)',
                          }
                      }
                  }
              }}
                sx={{'& .MuiSvgIcon-root': {color: 'rgba(255, 255, 255, 0.73)'}, backgroundImage: "linear-gradient(-200deg, #010d1b, #061f31)", color:"rgba(255, 255, 255, 0.73)", borderRadius:"10px"}}
                >
                <MenuItem value="https://chain.wax.io">Chain Wax</MenuItem>
                <MenuItem value="https://wax.cryptolions.io">Cryptolions</MenuItem>
                <MenuItem value="https://wax.eosDAC.io">eosDAC</MenuItem>
                <MenuItem value="https://wax.pink.qq">Pinkqq</MenuItem>
                <MenuItem value="https://api.wax.bountyblok.io">Bountyblok</MenuItem>
                <MenuItem value="https://wax.eoseoul.io">EOSeoul</MenuItem>
                <MenuItem value="https://wax.eosusa.io">EOSUSA</MenuItem>
            </Select>
            </FormControl>

            </Box>

    )
}
