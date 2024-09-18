import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect, useRef } from 'react';
import './App.css';

//import { Container, Row, Col, Card, Carousel } from 'react-bootstrap';
import { Card, Row, Col, Navbar, ButtonGroup, Button, Modal, Carousel, Form } from 'react-bootstrap';

const FullScreenImage = ({ imageUrl }: any) => {
	const [imageOrientation, setImageOrientation] = React.useState('vertical');

	// Check image orientation
	React.useEffect(() => {
		const img = new Image();
		img.onload = () => {
			setImageOrientation(img.width >= img.height ? 'horizontal' : 'vertical');
		};
		img.src = imageUrl;
	}, [imageUrl]);

	return (
		<div className={`full-screen-image-container ${imageOrientation}`}>
			<img src={imageUrl} alt="Full Screen" className="full-screen-image" />
		</div>
	);
};
const CollapsibleSection = ({ title, children }: any) => {
	const [isOpen, setIsOpen] = useState(false);

	const toggleAccordion = () => {
		setIsOpen(!isOpen);
	};

	return (
		<div style={{ marginBottom: '10px' }}>
			<div
				onClick={toggleAccordion}
				style={{
					backgroundColor: '#333',
					color: '#fff',
					padding: '10px',
					cursor: 'pointer',
				}}>
				{title}
			</div>
			{isOpen && (
				<div
					style={{
						backgroundColor: '#333',
						color: '#fff',
						padding: '10px',
					}}>
					{children}
				</div>
			)}
		</div>
	);
};
const ScrollableImageRow = ({ imagesList, height, onClick }: any) => {
	console.log(imagesList)
	return (
		<div
			style={{
				height: `calc(${height} + ${10 * 2}px)`,
				overflow: 'auto',
				whiteSpace: 'nowrap',
				padding: '10px',
				alignItems: 'center',
			}}>
			{imagesList.map((image: string, index: number) => (
				<img
					onClick={() => onClick(index)}
					key={image}
					src={image}
					alt={`${index + 1}`}
					style={{ height, width: 'auto', marginInline: '0.2rem' }}
				/>
			))}
		</div>
	);
};
const MoneyFormatter = ({ amount, currency }: any) => {
	// Format the amount as currency using Intl.NumberFormat
	const formattedAmount = new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: currency,
	}).format(amount);

	return <span>{formattedAmount}</span>;
};
const formatDateDifference = (date1: Date, date2: Date) =>
	`${Math.floor(Math.abs((date2.getTime() - date1.getTime()) / (1000 * 3600 * 24)))} days ago`;

function AuctionCard({ auction }: any) {
	const [showImageViewer, setShowImageViewer] = useState(-1);
	return (
		<Card
			style={{
				backgroundColor: '#333',
				color: 'white',
				marginBlock: '0.5rem',
			}}>
			<Card.Body>
				<Card.Title style={{ margin: '0.5rem' }}>{emojiDic[auction.leiloesType] + ' ' + auction.title}</Card.Title>
				<ScrollableImageRow
					onClick={(index: number) => setShowImageViewer(showImageViewer === -1 ? index : -1)}
					imagesList={auction.images}
					height="150px"
				/>
				<Row>
					<Col>
						<span>{formatDateDifference(new Date(), new Date(auction.fetched))}</span>
					</Col>
					<Col>
						<MoneyFormatter amount={Math.max(auction.bidActual, auction.bidStart)} currency="EUR" />
					</Col>
					<Col>
						<span>{auction.distance.toFixed(0)}</span>
						<span>Km</span>
					</Col>
				</Row>
				<CollapsibleSection
					title={'Details ' + auction.subType}
					style={{
						backgroundColor: '#222 !important',
						color: 'white !important',
						marginInline: '0.5rem',
						marginBottom: '0.5rem',
					}}>
					<p style={{ textAlign: 'justify' }}>{auction.leiloesDescription}</p>
					<a href={auction.link} target="_blank" rel="noopener noreferrer">
						Open website
					</a>
				</CollapsibleSection>
				{showImageViewer !== -1 && (
					<ImagesViewer images={auction.images} showImageViewer={showImageViewer} setShowImageViewer={setShowImageViewer} />
				)}
			</Card.Body>
		</Card>
	);
}

const emojiDic: { [id: string]: string } = {
	Imóvel: '🏠',
	Veículo: '🚗',
	Equipamento: '🔩',
	Máquina: '🖨',
	Mobiliário: '🛋',
	Direito: '🧑‍⚖️',
};
//className="bg-body-tertiary justify-content-between"
function MyNavBar({ setTypeFilter, setFilters, filters }: any) {
	const [buttonOn, setButtonOn] = useState(null);
	const TypeButton = ({ type }: any) => {
		return (
			<Button
				style={{ backgroundColor: buttonOn === type ? '#555' : '#333', margin: '0.1rem' }}
				onClick={() => {
					setTypeFilter(buttonOn !== type ? type : null);
					setButtonOn(buttonOn !== type ? type : null);
				}}>
				{emojiDic[type]}
			</Button>
		);
	};
	return (
		<Navbar sticky="top" bg="dark" data-bs-theme="dark" style={{ display: 'block', minHeight: '10vh' }}>
			<Row>
				<Navbar.Brand href="#home">Leiloa-mos</Navbar.Brand>
			</Row>
			<Row style={{ marginInline: '0.2rem' }}>
				<ButtonGroup size="sm">
					<TypeButton type={'Imóvel'} />
					<TypeButton type={'Veículo'} />
					<TypeButton type={'Equipamento'} />
					<TypeButton type={'Máquina'} />
					<TypeButton type={'Mobiliário'} />
					<TypeButton type={'Direito'} />
				</ButtonGroup>
				{buttonOn !== null && (
					<Form>
						<Form.Group as={Row}>
							<Form.Label column sm="4">
								{`Min dist ${filters[buttonOn]} km`}
							</Form.Label>
							<Col sm="8">
								<Form.Range
									value={filters[buttonOn]}
									onChange={(e) => {
										filters[buttonOn] = parseInt(e.target.value);
										setFilters(filters);
									}}
								/>
							</Col>
						</Form.Group>
					</Form>
				)}
			</Row>
		</Navbar>
	);
}
function ImagesViewer({ showImageViewer, setShowImageViewer, images }: any) {
	const handleClose = () => setShowImageViewer(-1);
	return (
		<>
			<Modal
				show={showImageViewer !== -1}
				fullscreen={true}
				onHide={handleClose}
				data-bs-theme="dark"
				style={{ backgroundColor: '#444', color: 'white' }}>
				<Modal.Header closeButton>
					<Modal.Title>Images</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Carousel interval={null} defaultActiveIndex={showImageViewer}>
						{images.map((image: any) => (
							<Carousel.Item key={image}>
								<div className="imageContainer">
									<img src={image} alt="Full Screen" className="carouselImage" />
								</div>
							</Carousel.Item>
						))}
					</Carousel>
				</Modal.Body>
			</Modal>
		</>
	);
}
function App() {
	const [data, setData] = useState([]);
	const [cards, setCards] = useState([]);
	const [sortedCards, setSortedCards] = useState([]);
	const [loading, setLoading] = useState(false);
	const [maxInView, setMaxInView] = useState(0);
	const [lastIndexInView, setLastIndexInView] = useState(0);
	const [sortAndFilterSettings, setSortAndFilterSettings] = useState({
		sort: 'fetched',
		dir: -1,
		typeFilter: null,
		filters: {
			Imóvel: 10,
			Veículo: 50,
			Equipamento: 50,
			Máquina: 50,
			Mobiliário: 50,
			Direito: 10,
		} as { [id: string]: number },
	});
	const observer: React.MutableRefObject<any> = useRef(null);
	const numberOfCards = 4;

	useEffect(() => {
		setLoading(true);
		fetch('https://raw.githubusercontent.com/JGEsteves89/leiloa-mos-frontend/main/data/leiloamos.json',{cache: 'no-cache'})
			.then((res) => res.json())
			.then((allData) => {
				console.log('Fetched ', allData.length, 'lots for auction');
				for(const entry of allData){
					entry.images = JSON.parse(entry.images)
				}
				setData(allData);
				setLoading(false);
			});
	}, []);

	useEffect(() => {
		let sorted = [...data];
		if (sortAndFilterSettings.typeFilter) {
			sorted = sorted.filter((f: any) => f.leiloesType === sortAndFilterSettings.typeFilter);
		}
		if (sortAndFilterSettings.filters) {
			sorted = sorted.filter((f: any) => f.distance < sortAndFilterSettings.filters[f.leiloesType]);
		}
		sorted = sorted.sort((a: any, b: any) =>
			a[sortAndFilterSettings.sort] > b[sortAndFilterSettings.sort] ? 1 * sortAndFilterSettings.dir : -1 * sortAndFilterSettings.dir
		);
		setSortedCards(sorted as any);
	}, [sortAndFilterSettings, data]);

	useEffect(() => {
		setLastIndexInView(numberOfCards);
		setMaxInView(sortedCards.length);
	}, [sortedCards]);

	useEffect(() => {
		setCards(sortedCards.slice(0, lastIndexInView));
	}, [lastIndexInView, sortedCards]);

	useEffect(() => {
		// Initialize IntersectionObserver
		observer.current = new IntersectionObserver(
			(entries) => {
				const lastEntry = entries[entries.length - 1];
				if (lastEntry.isIntersecting) {
					if (lastIndexInView < maxInView) {
						setLastIndexInView(lastIndexInView + numberOfCards);
					}
				}
			},
			{
				root: null,
				rootMargin: '0px',
				threshold: 0.1, // Trigger when 10% of card is visible
			}
		);

		// Observe the last card
		if (cards.length > 0) {
			const lastCard = document.querySelector('.card:last-child');
			if (lastCard) {
				observer.current.observe(lastCard);
			}
		}

		// Cleanup observer
		return () => {
			if (observer.current) {
				observer.current.disconnect();
			}
		};
	}, [cards]);

	console.log('Cards showing', cards.length);
	return (
		<div
			className="App"
			style={{
				backgroundColor: '#444',
				color: 'white',
			}}>
			<MyNavBar
				setTypeFilter={(typeFilter: any) => setSortAndFilterSettings({ ...sortAndFilterSettings, typeFilter })}
				setFilters={(filters: any) => setSortAndFilterSettings({ ...sortAndFilterSettings, filters })}
				filters={sortAndFilterSettings.filters}
			/>
			<div
				className="CardsContainer"
				style={{
					margin: 'auto',
					height: '93vh',
					minWidth: '95vw',
					display: 'flex',
					flexDirection: 'column',
					maxWidth: '95vw',
					overflowY: 'auto',
				}}>
				{cards.map((auction: any) => (
					<AuctionCard key={auction.id} auction={auction} />
				))}
			</div>
		</div>
	);
}

export default App;
