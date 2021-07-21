<script lang="ts">
	import * as _ from 'lodash';
	import { onMount } from 'svelte';
	import * as db from '../models/reviews.json';

	type App = {
		appid: number;
		name: string;
		reviews: Review[];
	};

	type Review = {
		body: string;
		play_time: number;
		recommended: boolean;
	}

	onMount(() => {
		data = data.map(app => ({
			...app,
			reviews: app.reviews as Review[]
		}));

		const storedHighscore = localStorage.getItem('highscore');
		highscore = storedHighscore ? parseInt(storedHighscore) : 0;
	})

	const toggleMute = () => {
		isMuted = !isMuted;
	}

	const getRandomApps = (n: number): App[] => {
		return _.sampleSize(data, n);
	}

	const getGuessClass = (app: App): string => {
		return app.appid === correct.appid ? 'correct' : 'incorrect';
	}

	const generateNewRound = () => {
		apps = getRandomApps(3);
		correct = _.sample(apps);
		review = _.sample(correct.reviews);
		hasGuessed = false;
	}

	const onGuess = (guess: App) => {
		hasGuessed = true;

		if (guess.appid === correct.appid) {
			score++;
			highscore = score > highscore ? score : highscore;
			localStorage.setItem('highscore', highscore.toString());

			isMuted ? '' : new Audio('sfx/correct.mp3').play();

			setTimeout(() => {
				generateNewRound();
			}, 1500);
		}
		else {
			score = 0;
			isMuted ? '' : new Audio('sfx/wrong.mp3').play();

			setTimeout(() => {
				generateNewRound();
			}, 3000);
		}
	}
	
	let score = 0;
	let highscore;
	let isMuted = false;
	let data: App[] = db['default'];
	let apps: App[] = getRandomApps(3);
	let correct: App = _.sample(apps);
	let review: Review = _.sample(correct.reviews);
	let hasGuessed = false;
</script>

<main>
	<h1>it's ok, i guess</h1>
	<h4>Guess from which game the Steam review came from!</h4>

	<div class="score-container">
		<div class="score-bubble">{ score }</div>
	</div>

	<div class="highscore">{ highscore }</div>

	<div class="choice-wrapper">
		<img class="mute-button {isMuted ? 'muted' : ''}" src="icons/mute.png" alt="Mute button" on:click={toggleMute} />
		<div class="choice-container">
		{#each apps as app}
			<div class="choice {hasGuessed && getGuessClass(app)}"on:click={() => onGuess(app)} style="{hasGuessed ? 'pointer-events:none;' : ''}">
				<img src="headers/{app.appid}_header.jpg" alt="{app.name} Banner" />
				<span>{ app.name }</span>
			</div>
		{/each}
		</div>
	</div>

	<div class="review-container">
		<img class="thumb-icon" src="icons/{ review.recommended ? 'thumbs-up.png' : 'thumbs-down.png' }" alt="" />
		<span class="play-time">{ review.play_time } hours on record</span>
		<span class="review-body">{ review.body }</span>
	</div>


	<div class="actions">
		<a href="https://github.com/aquelemiguel/its-ok-i-guess" target="_blank">
			<img src="icons/github.png" alt="GitHub logo" />
		</a>
		<a href="https://ko-fi.com/aquelemiguel" target="_blank">
			<img src="icons/kofi.png" alt="Ko-Fi logo" />
		</a>
		<a href="https://paypal.com/paypalme/aquelemiguel/1" target="_blank">
			<img src="icons/paypal.png" alt="PayPal logo" />
		</a>
	</div>
</main>

<style>
	main {
		display: flex;
		min-height: 100vh;
		flex-direction: column;
		text-align: center;
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 2em 0 2em;
	}

	h1 {
		font-size: 4em;
		font-weight: 900;
		margin: 1em 0 0 0;
	}

	h4 {
		font-weight: normal;
		margin-top: 0.5em;
		margin-bottom: 3em;
		color: #ffffff4f;
	}

	.score-container {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.score-bubble {
		display: flex;
		width: 75px;
		height: 75px;
		align-items: center;
		justify-content: center;
		background: whitesmoke;
		border-radius: 50%;
		font-size: 32px;
		mix-blend-mode: screen;
		color: black;
	}

	.highscore {
		filter: opacity(25%);
		margin-top: 0.5em;
	}

	.choice-wrapper {
		display: flex;
		flex-direction: column;
	}

	.mute-button {
		align-self: flex-end;
		margin-bottom: 0.5em;
		width: 28px;
		height: 28px;
		transition: all .2s ease;
		filter: opacity(25%);
		cursor: pointer;
	}

	.mute-button.muted {
		width: 28px;
		height: 28px;
		filter: opacity(100%);
	}

	.choice-container {
		display: flex;
		justify-content: space-around;
		
	}

	.choice {
		display: flex;
		flex-direction: column;
		font-family: '';
		width: 400px;
		height: 250px;
		background: #ffffff0f;
		border-radius: 10px;
		overflow: hidden;
		transition: all .2s ease;
		cursor: pointer;
		box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
	}

	.choice:first-child {
		margin-right: 1em;
	}

	.choice:last-child {
		margin-left: 1em;
	}

	.choice:hover, .choice.correct {
		transition: all .5s ease;
		background: whitesmoke;
		color: #1f2126;
	}

	.choice.incorrect {
		transition: all .5s ease;
		filter: opacity(25%);
	}

	.choice > img {
		max-width: 100%;
		max-height: 100%;
	}

	.choice > span {
		display: flex;
		font-family: 'Motiva Sans Bold';
		align-items: center;
		justify-content: center;
		flex-grow: 1;
		padding: 0 1em;
	}

	.review-container {
		display: grid;
		grid-template-columns: 64px 1fr;
		grid-template-rows: 22px 1fr;
		column-gap: 1.5em;
		margin: 2em 0;
		text-align: left;
		width: 100%;
		flex-grow: 1;
	}

	.thumb-icon {
		width: 64px;
		filter: opacity(25%);
		grid-row: 1/3;
		grid-column: 1;
	}

	.play-time {
		color: #ffffff49;
		grid-row: 1;
		grid-column: 2;
	}

	.review-body {
		font-family: 'Motiva Sans Bold';
		grid-row: 2;
		grid-column: 2;
		font-size: 24px;
	}

	.actions {
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 2em;
	}

	.actions img {
		width: 40px;
		padding: 12px;
		filter: opacity(25%);
		transition: all .5s ease;
	}

	.actions img:hover {
		filter: opacity(100%);
		transition: all .2s ease;
	}
	
	@media only screen and (max-width: 600px) {
		h1 {
			font-size: 32px;
			margin-top: 1em;
		}

		h4 {
			font-size: 16px;
			margin-bottom: 1.5em;
		}

		.highscore {
			margin-top: 0.5em;
			font-size: 12px;
		}

		.score-container {
			margin: 0 1em;
		}

		.score-bubble {
			width: 48px;
			height: 48px;
			font-size: 24px;
		}

		.choice-container {
			display: flex;
			flex-direction: column;
			margin: 0;
		}

		.mute-button {
			width: 24px;
			height: 24px;
		}

		.choice {
			width: auto;
			margin: 1.5em auto 0 auto !important;
			height: auto;
		}

		.choice:first-child {
			margin-top: 0 !important;
		}

		.choice:hover {
			background: unset;
			color: unset;
		}

		.choice.correct {
			transition: all .5s ease;
			background: whitesmoke;
			color: #1f2126;
		}

		.choice > span {
			height: 50px;
		}

		.review-body {
			font-size: 16px;
		}

		.actions {
			margin-bottom: 1em;
		}

		.actions img {
			padding: 8px;
		}
	}
</style>