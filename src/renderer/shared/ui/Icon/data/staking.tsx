import RedeemImg, { ReactComponent as RedeemSvg } from '@images/staking/redeem.svg';
import ChangeValidatorsImg, { ReactComponent as ChangeValidatorsSvg } from '@images/staking/change-validators.svg';
import SetValidatorsImg, { ReactComponent as SetValidatorsSvg } from '@images/staking/set-validators.svg';
import ReturnToStakeImg, { ReactComponent as ReturnToStakeSvg } from '@images/staking/return-to-stake.svg';
import UnstakeImg, { ReactComponent as UnstakeSvg } from '@images/staking/unstake.svg';
import DestinationImg, { ReactComponent as DestinationSvg } from '@images/staking/rewards-destination.svg';
import StakeMoreImg, { ReactComponent as StakeMoreSvg } from '@images/staking/stake-more.svg';
import StartStakingImg, { ReactComponent as StartStakingSvg } from '@images/staking/start-staking.svg';

const StakingImages = {
  redeem: { svg: RedeemSvg, img: RedeemImg },
  changeValidators: { svg: ChangeValidatorsSvg, img: ChangeValidatorsImg },
  setValidators: { svg: SetValidatorsSvg, img: SetValidatorsImg },
  returnToStake: { svg: ReturnToStakeSvg, img: ReturnToStakeImg },
  unstake: { svg: UnstakeSvg, img: UnstakeImg },
  destination: { svg: DestinationSvg, img: DestinationImg },
  stakeMore: { svg: StakeMoreSvg, img: StakeMoreImg },
  startStaking: { svg: StartStakingSvg, img: StartStakingImg },
} as const;

export type Staking = keyof typeof StakingImages;

export default StakingImages;
