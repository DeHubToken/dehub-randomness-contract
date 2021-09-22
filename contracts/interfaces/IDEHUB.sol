interface IDEHUB {
  function _buybackFee (  ) external view returns ( uint256 );
  function _collateralFee (  ) external view returns ( uint256 );
  function _distributionFee (  ) external view returns ( uint256 );
  function _expensesFee (  ) external view returns ( uint256 );
  function _liquidityFee (  ) external view returns ( uint256 );
  function _taxFee (  ) external view returns ( uint256 );
  function accumulatedForBuyback (  ) external view returns ( uint256 );
  function accumulatedForCollateral (  ) external view returns ( uint256 );
  function accumulatedForDistribution (  ) external view returns ( uint256 );
  function accumulatedForExpenses (  ) external view returns ( uint256 );
  function accumulatedForLiquidity (  ) external view returns ( uint256 );
  function addAddressToLPs ( address lpAddr ) external;
  function addInitialLiquidity ( uint256 tokenAmount, uint256 bnbAmount ) external;
  function allowance ( address ownr, address spender ) external view returns ( uint256 );
  function approve ( address spender, uint256 amount ) external returns ( bool );
  function balanceOf ( address account ) external view returns ( uint256 );
  function bnbAccumulatedForBuyback (  ) external view returns ( uint256 );
  function bnbAccumulatedForCollateral (  ) external view returns ( uint256 );
  function bnbAccumulatedForDistribution (  ) external view returns ( uint256 );
  function buyback ( uint256 bnbAmount ) external;
  function calcClaimableShare ( address holderAddr ) external view returns ( uint256 );
  function claimCycleHours (  ) external view returns ( uint256 );
  function claimReward (  ) external returns ( uint256 );
  function claimableDistribution (  ) external view returns ( uint256 );
  function collateralWallet (  ) external view returns ( address );
  function collateralize ( uint256 bnbAmount ) external;
  function deadAddr (  ) external view returns ( address );
  function decimals (  ) external pure returns ( uint8 );
  function decreaseAllowance ( address spender, uint256 subtractedValue ) external returns ( bool );
  function devShare (  ) external view returns ( uint256 );
  function devWallet (  ) external view returns ( address );
  function disableAllFeesTemporarily (  ) external;
  function disableRewardDistribution (  ) external returns ( bool );
  function disableSellLimit (  ) external;
  function enableRewardDistribution ( uint256 cycleHours ) external returns ( uint256 );
  function enableSellLimit (  ) external;
  function hasAlreadyClaimed ( address holderAddr ) external view returns ( bool );
  function hasCyclePassed (  ) external view returns ( bool );
  function increaseAllowance ( address spender, uint256 addedValue ) external returns ( bool );
  function initDEXRouter ( address router ) external;
  function isDistributionEnabled (  ) external view returns ( bool );
  function isSellLimitEnabled (  ) external view returns ( bool );
  function lastCycleResetTimestamp (  ) external view returns ( uint256 );
  function licensingShare (  ) external view returns ( uint256 );
  function licensingWallet (  ) external view returns ( address );
  function liquidityPools ( address ) external view returns ( bool );
  function marketingShare (  ) external view returns ( uint256 );
  function marketingWallet (  ) external view returns ( address );
  function maxSellAllowanceMultiplier (  ) external view returns ( uint256 );
  function maxSellAllowancePerCycle (  ) external view returns ( uint256 );
  function maxTxAmount (  ) external view returns ( uint256 );
  function maxWalletSize (  ) external view returns ( uint256 );
  function minToBuyback (  ) external view returns ( uint256 );
  function minToCollateral (  ) external view returns ( uint256 );
  function minToDistribution (  ) external view returns ( uint256 );
  function minToExpenses (  ) external view returns ( uint256 );
  function minToLiquify (  ) external view returns ( uint256 );
  function name (  ) external pure returns ( string memory );
  function owner (  ) external view returns ( address );
  function reflectionFromToken ( uint256 tAmount, bool deductTransferFee ) external view returns ( uint256 );
  function removeAddressFromLPs ( address lpAddr ) external;
  function renounceOwnership (  ) external;
  function restoreAllFees (  ) external;
  function sellAllowanceLeft (  ) external view returns ( uint256 );
  function sellCycleHours (  ) external view returns ( uint256 );
  function setBuybackFee ( uint256 fee ) external;
  function setCollateralFee ( uint256 fee ) external;
  function setCollateralWallet ( address wallet ) external;
  function setDevWallet ( address wallet, uint256 share ) external;
  function setDistributionFee ( uint256 fee ) external;
  function setExpensesFee ( uint256 fee ) external;
  function setLicensingWallet ( address wallet, uint256 share ) external;
  function setLiquidityFee ( uint256 fee ) external;
  function setMarketingWallet ( address wallet, uint256 share ) external;
  function setMaxSellAllowanceMultiplier ( uint256 mult ) external;
  function setMinToBuyback ( uint256 minTokens ) external;
  function setMinToCollateral ( uint256 minTokens ) external;
  function setMinToDistribution ( uint256 minTokens ) external;
  function setMinToExpenses ( uint256 minTokens ) external;
  function setMinToLiquify ( uint256 minTokens ) external;
  function setReflectionFee ( uint256 fee ) external;
  function setSellCycleHours ( uint256 hoursCycle ) external;
  function specialAddresses ( address ) external view returns ( bool );
  function symbol (  ) external pure returns ( string memory );
  function toggleLimitExemptions ( address addr, bool allToggle, bool txToggle, bool walletToggle, bool sellToggle, bool feesToggle ) external;
  function toggleSpecialWallets ( address specialAddr, bool toggle ) external;
  function tokenFromReflection ( uint256 rAmount ) external view returns ( uint256 );
  function totalCirculatingSupply (  ) external view returns ( uint256 );
  function totalClaimed (  ) external view returns ( uint256 );
  function totalClaimedDuringCycle (  ) external view returns ( uint256 );
  function totalFees (  ) external view returns ( uint256 );
  function totalSupply (  ) external pure returns ( uint256 );
  function transfer ( address recipient, uint256 amount ) external returns ( bool );
  function transferFrom ( address sender, address recipient, uint256 amount ) external returns ( bool );
  function transferOwnership ( address newOwner ) external;
  function triggerExpensify (  ) external;
  function triggerLiquify (  ) external;
  function triggerSellForBuyback (  ) external;
  function triggerSellForCollateral (  ) external;
  function triggerSellForDistribution (  ) external;
}
