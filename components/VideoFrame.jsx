export const VideoFrame = ({ src }) => {
	return (
		<Frame>
			<video
				autoPlay
				loop
				muted
				playsInline
				width="100%"
				style={{ borderRadius: "12px" }}
			>
				<source src={src} type="video/mp4" />
			</video>
		</Frame>
	);
};
