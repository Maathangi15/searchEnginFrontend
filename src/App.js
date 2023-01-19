import {useState, useEffect} from 'react';
import { useSearchParams } from "react-router-dom"
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import TablePagination from '@mui/material/TablePagination';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import TextField from '@mui/material/TextField'




const theme = createTheme();

export default function App() {
	const [results, setResults] = useState([])
	const [num_results, setNum_results] = useState({result: 0, time: 0})
    const [loading, setLoading] = useState(false)

	const [searchParams, setSearchParams] = useSearchParams()
    const [query, setQuery] = useState(searchParams.get("query") || "")
	const [sub, setSub] = useState(false)

	const handleSearchChange = (e) => {
        setQuery(e.target.value)
    }

    const handleSubmit = (e) => {
		setSub(su=>!su)
        e.preventDefault()
        setSearchParams({ query })
    }


	const [page, setPage] = useState(0);
  	const [rowsPerPage, setRowsPerPage] = useState(5);

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(parseInt(event.target.value));
		setPage(0);
	};
	
    useEffect(() => {
        setLoading(true)
        fetch("http://127.0.0.1:5000/search", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            details: JSON.stringify({
                query: searchParams.get("query"),
				page: page,
				rows_per_page: rowsPerPage
            }),
        })
            .then((res) => res.json())
            .then((data) => {
				setNum_results({result: data.num_results, time: data.time})
                setResults(data.hits)
                setLoading(false)
            })
			.catch(()=>{
				setLoading(false)
			})
    }, [searchParams, sub, rowsPerPage, page])

	return (
		<ThemeProvider theme={theme}>
			<form onSubmit={handleSubmit}>
			<main >
				<Box
					sx={{
						bgcolor: 'background.paper',
						pt: 8,
						pb: 6,
						
					}}
				>
					<Card sx={{m: 2, p: 2}} >
						<Stack container spacing={4} >
							<Grid container spacing={2}>
								<Grid item xs={10} >
									<Box sx={{display: 'flex', flexDirection: 'column'}}>
										<TextField 
											id="outlined-basic" 
											label="Search here..." 
											fullwidth 
											size='medium' 
											variant="outlined" 
											onChange={handleSearchChange}
										/>
									</Box>
									
								</Grid>
								<Grid item>
									<Button 
										variant="contained"
										sx={{height: '100%', width: '100%'}}
										type='submit'
										color='secondary'
									>
										Search
									</Button>
								</Grid>
							</Grid>
						</Stack>
					</Card>
				</Box>
				{ loading && 
					<Backdrop
						sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
						open={loading}
					>
						<CircularProgress color="inherit" />
					</Backdrop>
				}
				<Card sx={{ py: 2, px: 2, m: 2 }} maxWidth="md">
					<TablePagination
						component="div"
						count={num_results.result}
						page={page}
						onPageChange={handleChangePage}
						rowsPerPage={rowsPerPage}
						onRowsPerPageChange={handleChangeRowsPerPage}
						rowsPerPageOptions={[5, 10, 25, 50, 100]}
					/>
					<Grid container spacing={4}>
						{results?.map(({_source: {album, composer, lyricist, lyrics, metaphors, singers, year}, _id}, id) => (
							<Grid item key={_id} xs={12} sm={12} md={12}>
								<Card
									sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
								>
									<CardContent sx={{ flexGrow: 1 }}>
										<Typography gutterBottom variant="h5" component="h2">
											{id+1}) {album}
										</Typography>
										<Grid item container >
											<Grid item md={4} >
											<Typography size="small">Year: {year}</Typography>

											</Grid>
											<Grid item md={4} >
											<Typography size="small">Lyricist: {lyricist}</Typography>

											</Grid>
											<Grid item md={4} >
											<Typography size="small">Composer: {composer}</Typography>

											</Grid>
											<Grid item md={12} >
											<Typography size="small">Singers: {singers}</Typography>

											</Grid>
										</Grid>
										<Grid item container >
										{
											metaphors.map(({source, target,interpretation, metaphor}, id)=>(
												
												
													<Grid item md={4} key={source+target}>
														<h5>Metaphor: {id+1}</h5>
														<Typography>
															Metaphor :{metaphor}
														</Typography>
														<Typography>
															source :{source}
														</Typography>
														<Typography>
															Target :{target}
														</Typography>
														<Typography>
															Interpretation :{interpretation}
														</Typography>
													</Grid>
												
											))
										}
										</Grid>
										<h3>Lyrics</h3>
										<Typography>
											{lyrics}
										</Typography>
										
									</CardContent>
									
								</Card>
							</Grid>
						))}
					</Grid>
					
				</Card>
			</main>
			
			</form>
		</ThemeProvider>
	);
}